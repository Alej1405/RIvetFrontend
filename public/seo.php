<?php
/**
 * Meta tags al vuelo para los rastreadores.
 *
 * El sitio es una SPA: el servidor devuelve siempre el mismo index.html y los
 * meta tags reales los escribe React ya en el navegador. WhatsApp, Facebook,
 * Instagram y LinkedIn NO ejecutan JavaScript: leen el HTML crudo y se van.
 * Sin esto, todo el catálogo y todo el blog se comparten con el título y la
 * imagen de la portada.
 *
 * Por qué PHP y no un prerender en el build: porque el cliente publica un
 * producto cuando quiere, y no puede depender de que alguien lance un
 * despliegue para que ese producto se comparta bien. Aquí el dato se pide al
 * ERP en el momento, así que un producto creado hace un minuto ya se comparte
 * con su foto y su precio.
 *
 * No es cloaking: **a todo el mundo se le sirve el mismo HTML**, el bundle de
 * siempre con las etiquetas de esa ruta resueltas. React arranca encima igual
 * que antes y el visitante no nota nada.
 *
 * Si el ERP no responde, se sirve el index.html tal cual. La página nunca se
 * cae por esto: en el peor caso se comparte con la tarjeta genérica.
 */

declare(strict_types=1);

const MARCA = 'RIVET Ecuador';
const SITIO = 'https://rivet-ec.com';
const OG_DEFECTO = SITIO . '/rivet_logo_editable.png';

/** Cuánto vale un dato del ERP antes de volver a pedirlo. */
const CACHE_SEGUNDOS = 300;

/** Un rastreador no espera: si el ERP tarda más que esto, se sirve lo genérico. */
const TIMEOUT = 4;

$raiz = __DIR__;

// ── Configuración ────────────────────────────────────────────────────────────
// El token vive FUERA de public_html y fuera del repositorio: el despliegue
// borra y reescribe public_html entero, y una clave en Git es una clave
// quemada. Se crea una sola vez en el servidor (ver scripts/desplegar.sh).
$config = ['api' => 'https://erp.mashaec.net/api', 'slug' => 'rivet-ecuador-sas', 'token' => ''];
$archivoConfig = dirname($raiz) . '/rivet-seo-config.php';

if (is_readable($archivoConfig)) {
    $config = array_merge($config, (array) require $archivoConfig);
}

/** La caché también vive fuera: el rsync del despliegue no la puede borrar. */
$dirCache = dirname($raiz) . '/rivet-seo-cache';

// ── Utilidades ───────────────────────────────────────────────────────────────

function esc(?string $texto): string
{
    return htmlspecialchars((string) $texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Recorta a lo que muestran los buscadores y las tarjetas, sin cortar una palabra. */
function resumir(?string $texto, int $limite = 160): string
{
    $limpio = trim(preg_replace('/\s+/u', ' ', strip_tags(html_entity_decode((string) $texto, ENT_QUOTES, 'UTF-8'))) ?? '');

    if ($limpio === '' || mb_strlen($limpio) <= $limite) {
        return $limpio;
    }

    $corto = mb_substr($limpio, 0, $limite);
    $espacio = mb_strrpos($corto, ' ');

    return rtrim($espacio > 40 ? mb_substr($corto, 0, $espacio) : $corto) . '…';
}

/**
 * og:image tiene que ser absoluta: las redes no resuelven rutas relativas, y
 * las imágenes de producto llegan como ruta suelta que solo existe bajo /storage.
 */
function imagenAbsoluta(?string $imagen, string $api): string
{
    if (!$imagen) {
        return OG_DEFECTO;
    }

    if (preg_match('#^https?://#i', $imagen)) {
        return $imagen;
    }

    $origen = preg_replace('#/api/?$#', '', $api);

    return $origen . '/storage/' . ltrim($imagen, '/');
}

/** Pide un recurso al ERP con caché en disco. Devuelve null si algo falla. */
function pedir(string $recurso, array $config, string $dirCache): ?array
{
    if ($config['token'] === '') {
        return null;
    }

    $clave = $dirCache . '/' . sha1($recurso) . '.json';

    if (is_readable($clave) && (time() - filemtime($clave)) < CACHE_SEGUNDOS) {
        $guardado = json_decode((string) file_get_contents($clave), true);

        if (is_array($guardado)) {
            return $guardado;
        }
    }

    $contexto = stream_context_create(['http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer {$config['token']}\r\nAccept: application/json\r\n",
        'timeout' => TIMEOUT,
        'ignore_errors' => true,
    ]]);

    $cuerpo = @file_get_contents("{$config['api']}/{$recurso}", false, $contexto);
    $datos = $cuerpo === false ? null : json_decode($cuerpo, true);

    if (!is_array($datos)) {
        // El ERP no respondió o devolvió basura. Si hay una copia vieja en
        // caché se usa aunque haya caducado: una descripción de hace una hora
        // vale más que la tarjeta genérica.
        if (is_readable($clave)) {
            $viejo = json_decode((string) file_get_contents($clave), true);

            if (is_array($viejo)) {
                return $viejo;
            }
        }

        return null;
    }

    if (!is_dir($dirCache)) {
        @mkdir($dirCache, 0755, true);
    }

    @file_put_contents($clave, json_encode($datos), LOCK_EX);

    return $datos;
}

/**
 * Sustituye el valor de una etiqueta ya presente en el index.html.
 * Se reemplaza en vez de añadir para no acabar con dos og:title en la misma
 * página: las redes toman el primero que encuentran y sería siempre el genérico.
 */
function reemplazarMeta(string $html, string $atributo, string $nombre, string $valor): string
{
    $patron = '#(<meta\s+' . $atributo . '=["\']' . preg_quote($nombre, '#') . '["\']\s+content=["\'])[^"\']*(["\']\s*/?>)#i';

    return preg_replace($patron, '${1}' . str_replace('$', '\$', esc($valor)) . '${2}', $html, 1) ?? $html;
}

/** El bloque común: título, descripción, canonical, OpenGraph y Twitter. */
function aplicarSeo(string $html, array $d): string
{
    $completo = $d['titulo'] === MARCA ? $d['titulo'] : $d['titulo'] . ' · ' . MARCA;

    $html = preg_replace('#<title>[^<]*</title>#i', '<title>' . esc($completo) . '</title>', $html, 1) ?? $html;
    $html = reemplazarMeta($html, 'name', 'description', $d['descripcion']);
    $html = reemplazarMeta($html, 'property', 'og:type', $d['tipo'] ?? 'website');
    $html = reemplazarMeta($html, 'property', 'og:title', $completo);
    $html = reemplazarMeta($html, 'property', 'og:description', $d['descripcion']);
    $html = reemplazarMeta($html, 'property', 'og:url', $d['url']);
    $html = reemplazarMeta($html, 'property', 'og:image', $d['imagen']);
    $html = reemplazarMeta($html, 'property', 'og:image:alt', $d['titulo']);
    $html = reemplazarMeta($html, 'name', 'twitter:title', $completo);
    $html = reemplazarMeta($html, 'name', 'twitter:description', $d['descripcion']);
    $html = reemplazarMeta($html, 'name', 'twitter:url', $d['url']);
    $html = reemplazarMeta($html, 'name', 'twitter:image', $d['imagen']);

    // El canonical apunta a la ruta pública para que Google no indexe /seo.php.
    $html = preg_replace(
        '#<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']*["\']\s*/?>#i',
        '<link rel="canonical" href="' . esc($d['url']) . '" />',
        $html,
        1,
    ) ?? $html;

    if (!empty($d['jsonld'])) {
        $json = str_replace('<', '<', json_encode($d['jsonld'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        $html = str_replace('</head>', '  <script type="application/ld+json">' . $json . "</script>\n</head>", $html);
    }

    // Copia del contenido para quien no ejecuta JavaScript. Va en <noscript> y
    // no en el contenedor de React: si se escribe ahí, el visitante ve el
    // bloque sin estilos durante un instante antes de que React lo reemplace.
    if (!empty($d['noscript'])) {
        $html = str_replace('</body>', "  <noscript>\n    " . implode("\n    ", $d['noscript']) . "\n  </noscript>\n</body>", $html);
    }

    return $html;
}

function migaDePan(array $items): array
{
    $lista = [];

    foreach ($items as $i => $item) {
        $lista[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $item[0], 'item' => SITIO . $item[1]];
    }

    return ['@type' => 'BreadcrumbList', 'itemListElement' => $lista];
}

/** Busca una categoría por slug en el árbol que devuelve el ERP. */
function buscarCategoria(array $arbol, string $slug, ?array $padre = null): ?array
{
    foreach ($arbol as $c) {
        if (($c['slug'] ?? '') === $slug) {
            return ['categoria' => $c, 'padre' => $padre];
        }

        if (!empty($c['children']) && is_array($c['children'])) {
            $hallado = buscarCategoria($c['children'], $slug, $c);

            if ($hallado) {
                return $hallado;
            }
        }
    }

    return null;
}

// ── Resolución de la ruta ────────────────────────────────────────────────────

$plantilla = @file_get_contents($raiz . '/index.html');

if ($plantilla === false) {
    http_response_code(500);
    exit('No se encontró index.html.');
}

// Las etiquetas del index.html vienen partidas en varias líneas: se aplanan
// antes de sustituir o el patrón no las reconoce.
$plantilla = preg_replace_callback(
    '#<meta\s+[^>]*>#',
    static fn (array $m): string => (string) preg_replace('/\s+/', ' ', $m[0]),
    $plantilla,
) ?? $plantilla;

$ruta = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$ruta = '/' . trim((string) $ruta, '/');

header('Content-Type: text/html; charset=UTF-8');
// Un minuto de caché en el borde: alivia al ERP sin retrasar un cambio real.
header('Cache-Control: public, max-age=60');

$pintar = static function (string $html): never {
    echo $html;
    exit;
};

// ── /producto/<slug> ─────────────────────────────────────────────────────────
if (preg_match('#^/producto/([\w-]+)$#', $ruta, $m)) {
    $lote = pedir("ecommerce/{$config['slug']}/products?per_page=200", $config, $dirCache);
    $producto = null;

    foreach ($lote['data'] ?? [] as $p) {
        if (($p['slug'] ?? '') === $m[1]) {
            $producto = $p;
            break;
        }
    }

    if (!$producto) {
        $pintar($plantilla);
    }

    $descripcion = resumir($producto['meta_descripcion'] ?? $producto['descripcion'] ?? $producto['nombre']);
    $url = SITIO . '/producto/' . $producto['slug'];

    $foto = null;

    foreach ($producto['imagenes'] ?? [] as $img) {
        if (!empty($img['es_principal'])) {
            $foto = $img['path'];
            break;
        }

        $foto ??= $img['path'] ?? null;
    }

    $imagen = imagenAbsoluta($foto, $config['api']);
    $categoria = $producto['store_category'] ?? null;
    $precio = (float) ($producto['precio_venta'] ?? 0);

    $ficha = [
        '@type' => 'Product',
        'name' => $producto['nombre'],
        'description' => $descripcion,
        'image' => [$imagen],
        'url' => $url,
        'brand' => ['@type' => 'Brand', 'name' => MARCA],
    ];

    if (!empty($producto['sku'])) {
        $ficha['sku'] = (string) $producto['sku'];
    }

    if ($categoria) {
        $ficha['category'] = $categoria['nombre'];
    }

    // El precio en los datos estructurados es lo que hace que Google muestre la
    // ficha con precio y disponibilidad en el resultado de búsqueda.
    if ($precio > 0) {
        $ficha['offers'] = [
            '@type' => 'Offer',
            'price' => number_format($precio, 2, '.', ''),
            'priceCurrency' => 'USD',
            'availability' => 'https://schema.org/InStock',
            'url' => $url,
            'seller' => ['@type' => 'Organization', 'name' => 'Rivet Ecuador S.A.S.'],
        ];
    }

    $miga = [['Inicio', '/'], ['Catálogo', '/catalogo']];

    if ($categoria) {
        $miga[] = [$categoria['nombre'], '/catalogo/' . $categoria['slug']];
    }

    $miga[] = [$producto['nombre'], '/producto/' . $producto['slug']];

    $noscript = ['<h1>' . esc($producto['nombre']) . '</h1>', '<p>' . esc($descripcion) . '</p>'];

    if ($precio > 0) {
        $noscript[] = '<p>USD ' . number_format($precio, 2) . '</p>';
    }

    foreach ($producto['caracteristicas'] ?? [] as $c) {
        $noscript[] = '<li>' . esc(is_array($c) ? ($c['texto'] ?? '') : (string) $c) . '</li>';
    }

    $pintar(aplicarSeo($plantilla, [
        'titulo' => $producto['meta_titulo'] ?: $producto['nombre'],
        'descripcion' => $descripcion,
        'url' => $url,
        'imagen' => $imagen,
        'tipo' => 'article',
        'jsonld' => ['@context' => 'https://schema.org', '@graph' => [$ficha, migaDePan($miga)]],
        'noscript' => $noscript,
    ]));
}

// ── /catalogo/<slug> ─────────────────────────────────────────────────────────
if (preg_match('#^/catalogo/([\w-]+)$#', $ruta, $m)) {
    $arbol = pedir("ecommerce/{$config['slug']}/categories", $config, $dirCache) ?? [];
    $hallado = buscarCategoria($arbol, $m[1]);

    if (!$hallado) {
        $pintar($plantilla);
    }

    $categoria = $hallado['categoria'];
    $lote = pedir("ecommerce/{$config['slug']}/products?per_page=200", $config, $dirCache);
    $suyos = [];

    foreach ($lote['data'] ?? [] as $p) {
        if (($p['store_category']['slug'] ?? '') === $categoria['slug']) {
            $suyos[] = $p;
        }
    }

    $descripcion = resumir(
        $categoria['meta_descripcion']
            ?: ($categoria['descripcion']
            ?: ($categoria['contenido']
            ?: $categoria['nombre'] . ' de Rivet Ecuador: ' . count($suyos) . ' producto(s) con precio de distribuidor.')),
    );
    $url = SITIO . '/catalogo/' . $categoria['slug'];

    $lista = [];
    $noscript = ['<h1>' . esc($categoria['nombre']) . '</h1>', '<p>' . esc($descripcion) . '</p>'];

    foreach ($suyos as $i => $p) {
        $lista[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $p['nombre'], 'url' => SITIO . '/producto/' . $p['slug']];
        $noscript[] = '<li><a href="' . SITIO . '/producto/' . esc($p['slug']) . '">' . esc($p['nombre']) . '</a></li>';
    }

    $miga = [['Inicio', '/'], ['Catálogo', '/catalogo']];

    if ($hallado['padre']) {
        $miga[] = [$hallado['padre']['nombre'], '/catalogo/' . $hallado['padre']['slug']];
    }

    $miga[] = [$categoria['nombre'], '/catalogo/' . $categoria['slug']];

    $pintar(aplicarSeo($plantilla, [
        'titulo' => $categoria['meta_titulo'] ?: $categoria['nombre'],
        'descripcion' => $descripcion,
        'url' => $url,
        'imagen' => imagenAbsoluta($categoria['banner'] ?: $categoria['imagen'], $config['api']),
        'jsonld' => ['@context' => 'https://schema.org', '@graph' => [
            ['@type' => 'CollectionPage', 'name' => $categoria['nombre'], 'description' => $descripcion, 'url' => $url],
            ['@type' => 'ItemList', 'numberOfItems' => count($suyos), 'itemListElement' => $lista],
            migaDePan($miga),
        ]],
        'noscript' => $noscript,
    ]));
}

// ── /catalogo ────────────────────────────────────────────────────────────────
if ($ruta === '/catalogo') {
    $arbol = pedir("ecommerce/{$config['slug']}/categories", $config, $dirCache) ?? [];
    $lote = pedir("ecommerce/{$config['slug']}/products?per_page=200", $config, $dirCache);
    $productos = $lote['data'] ?? [];

    $nombres = array_column($arbol, 'nombre');
    $descripcion = resumir(
        'Catálogo de Rivet Ecuador: ' . count($productos) . ' producto(s) propio(s) con precio de distribuidor'
        . ($nombres ? '. Categorías: ' . implode(', ', $nombres) . '.' : '.'),
    );

    $lista = [];
    $noscript = ['<h1>Catálogo de Rivet Ecuador</h1>'];

    foreach ($productos as $i => $p) {
        $lista[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $p['nombre'], 'url' => SITIO . '/producto/' . $p['slug']];
        $noscript[] = '<li><a href="' . SITIO . '/producto/' . esc($p['slug']) . '">' . esc($p['nombre']) . '</a></li>';
    }

    $pintar(aplicarSeo($plantilla, [
        'titulo' => 'Catálogo',
        'descripcion' => $descripcion,
        'url' => SITIO . '/catalogo',
        'imagen' => OG_DEFECTO,
        'jsonld' => ['@context' => 'https://schema.org', '@graph' => [
            ['@type' => 'CollectionPage', 'name' => 'Catálogo · ' . MARCA, 'description' => $descripcion, 'url' => SITIO . '/catalogo'],
            ['@type' => 'ItemList', 'numberOfItems' => count($productos), 'itemListElement' => $lista],
            migaDePan([['Inicio', '/'], ['Catálogo', '/catalogo']]),
        ]],
        'noscript' => $noscript,
    ]));
}

// ── /blog/<slug> ─────────────────────────────────────────────────────────────
if (preg_match('#^/blog/([\w-]+)$#', $ruta, $m)) {
    $post = pedir("cms/{$config['slug']}/posts/{$m[1]}", $config, $dirCache);

    if (!$post || empty($post['titulo'])) {
        $pintar($plantilla);
    }

    $descripcion = resumir($post['extracto'] ?? $post['contenido'] ?? $post['titulo']);
    $url = SITIO . '/blog/' . $post['slug'];
    $imagen = imagenAbsoluta($post['imagen'] ?? null, $config['api']);

    $articulo = [
        '@type' => 'NewsArticle',
        'headline' => $post['titulo'],
        'description' => $descripcion,
        'image' => [$imagen],
        'url' => $url,
        'publisher' => ['@type' => 'Organization', 'name' => 'Rivet Ecuador S.A.S.'],
    ];

    if (!empty($post['publicado_en'])) {
        $articulo['datePublished'] = $post['publicado_en'];
    }

    $html = aplicarSeo($plantilla, [
        'titulo' => $post['titulo'],
        'descripcion' => $descripcion,
        'url' => $url,
        'imagen' => $imagen,
        'tipo' => 'article',
        'jsonld' => ['@context' => 'https://schema.org', '@graph' => [
            $articulo,
            migaDePan([['Inicio', '/'], ['Blog', '/blog'], [$post['titulo'], '/blog/' . $post['slug']]]),
        ]],
        'noscript' => ['<h1>' . esc($post['titulo']) . '</h1>', '<p>' . esc($descripcion) . '</p>'],
    ]);

    if (!empty($post['publicado_en'])) {
        $html = str_replace(
            '</head>',
            '  <meta property="article:published_time" content="' . esc($post['publicado_en']) . "\" />\n</head>",
            $html,
        );
    }

    $pintar($html);
}

// ── /blog ────────────────────────────────────────────────────────────────────
if ($ruta === '/blog') {
    $posts = pedir("cms/{$config['slug']}/posts", $config, $dirCache) ?? [];
    $descripcion = resumir(
        $posts
            ? 'Novedades de Rivet Ecuador: ' . resumir($posts[0]['titulo'] ?? '', 60) . ' y ' . max(0, count($posts) - 1) . ' publicación(es) más sobre ingeniería alimentaria, maquila y permisos ARCSA.'
            : 'Novedades de Rivet Ecuador sobre ingeniería alimentaria, maquila y permisos ARCSA.',
    );

    $lista = [];
    $noscript = ['<h1>Blog de Rivet Ecuador</h1>'];

    foreach ($posts as $i => $p) {
        $lista[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $p['titulo'], 'url' => SITIO . '/blog/' . $p['slug']];
        $noscript[] = '<li><a href="' . SITIO . '/blog/' . esc($p['slug']) . '">' . esc($p['titulo']) . '</a></li>';
    }

    $pintar(aplicarSeo($plantilla, [
        'titulo' => 'Blog',
        'descripcion' => $descripcion,
        'url' => SITIO . '/blog',
        'imagen' => imagenAbsoluta($posts[0]['imagen'] ?? null, $config['api']),
        'jsonld' => ['@context' => 'https://schema.org', '@graph' => [
            ['@type' => 'Blog', 'name' => 'Blog · ' . MARCA, 'description' => $descripcion, 'url' => SITIO . '/blog'],
            ['@type' => 'ItemList', 'numberOfItems' => count($posts), 'itemListElement' => $lista],
            migaDePan([['Inicio', '/'], ['Blog', '/blog']]),
        ]],
        'noscript' => $noscript,
    ]));
}

// Cualquier otra ruta: el index.html tal cual, que ya trae las metas de la marca.
$pintar($plantilla);
