<?php
/**
 * El sitemap, generado en el momento.
 *
 * Un producto o una noticia que se publica hoy en el ERP entra aquí hoy, sin
 * desplegar nada. Esa es la razón de que esto sea PHP y no un archivo escrito
 * en el build: el cliente publica cuando quiere y el sitemap tiene que
 * reflejarlo solo.
 *
 * Se cachea una hora. Google no lo pide más seguido que eso, y si el ERP está
 * caído se sirve la última copia buena en vez de un XML vacío — un sitemap
 * vacío le dice a Google que el sitio ya no tiene páginas, y eso sí hace daño.
 */

declare(strict_types=1);

const SITIO = 'https://rivet-ec.com';
const CACHE_SEGUNDOS = 3600;
const TIMEOUT = 6;

$raiz = __DIR__;

$config = ['api' => 'https://erp.mashaec.net/api', 'slug' => 'rivet-ecuador-sas', 'token' => ''];
$archivoConfig = dirname($raiz) . '/rivet-seo-config.php';

if (is_readable($archivoConfig)) {
    $config = array_merge($config, (array) require $archivoConfig);
}

$dirCache = dirname($raiz) . '/rivet-seo-cache';
$copia = $dirCache . '/sitemap.xml';

header('Content-Type: application/xml; charset=UTF-8');

// Servir la copia mientras esté fresca.
if (is_readable($copia) && (time() - filemtime($copia)) < CACHE_SEGUNDOS) {
    readfile($copia);
    exit;
}

function pedir(string $recurso, array $config): ?array
{
    if ($config['token'] === '') {
        return null;
    }

    $contexto = stream_context_create(['http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer {$config['token']}\r\nAccept: application/json\r\n",
        'timeout' => TIMEOUT,
        'ignore_errors' => true,
    ]]);

    $cuerpo = @file_get_contents("{$config['api']}/{$recurso}", false, $contexto);
    $datos = $cuerpo === false ? null : json_decode($cuerpo, true);

    return is_array($datos) ? $datos : null;
}

/** Las categorías llegan en árbol; para las URLs hacen falta planas. */
function aplanar(array $arbol, array &$salida = []): array
{
    foreach ($arbol as $c) {
        $salida[] = $c;

        if (!empty($c['children']) && is_array($c['children'])) {
            aplanar($c['children'], $salida);
        }
    }

    return $salida;
}

function fila(string $loc, string $cambia, string $prioridad, ?string $fecha = null): string
{
    return '  <url><loc>' . SITIO . $loc . '</loc>'
        . ($fecha ? '<lastmod>' . htmlspecialchars(substr($fecha, 0, 10), ENT_QUOTES) . '</lastmod>' : '')
        . "<changefreq>{$cambia}</changefreq><priority>{$prioridad}</priority></url>";
}

$filas = [
    fila('/', 'weekly', '1.0'),
    fila('/catalogo', 'daily', '0.9'),
    fila('/servicios', 'monthly', '0.8'),
    fila('/blog', 'weekly', '0.7'),
    fila('/nosotros', 'monthly', '0.6'),
    fila('/puntos-venta', 'monthly', '0.6'),
    fila('/faq', 'yearly', '0.3'),
];

$arbol = pedir("ecommerce/{$config['slug']}/categories", $config) ?? [];
$vacio = [];

foreach (aplanar($arbol, $vacio) as $c) {
    if (!empty($c['slug'])) {
        $filas[] = fila('/catalogo/' . $c['slug'], 'weekly', '0.7');
    }
}

// El paginador de Laravel: se recorren todas las páginas o el catálogo sale cortado.
$pagina = 1;
$ultima = 1;
$productos = 0;

do {
    $lote = pedir("ecommerce/{$config['slug']}/products?per_page=100&page={$pagina}", $config);

    foreach ($lote['data'] ?? [] as $p) {
        if (!empty($p['slug'])) {
            $filas[] = fila('/producto/' . $p['slug'], 'weekly', '0.8', $p['updated_at'] ?? null);
            $productos++;
        }
    }

    $ultima = (int) ($lote['last_page'] ?? 1);
    $pagina++;
} while ($pagina <= $ultima && $pagina <= 20);

$noticias = 0;

foreach (pedir("cms/{$config['slug']}/posts", $config) ?? [] as $post) {
    if (!empty($post['slug'])) {
        $filas[] = fila('/blog/' . $post['slug'], 'monthly', '0.6', $post['publicado_en'] ?? null);
        $noticias++;
    }
}

$xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    . "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    . implode("\n", $filas)
    . "\n</urlset>\n";

// Si el ERP no dio nada, no se pisa la copia buena con un sitemap pelado.
if ($productos > 0 || $noticias > 0) {
    if (!is_dir($dirCache)) {
        @mkdir($dirCache, 0755, true);
    }

    @file_put_contents($copia, $xml, LOCK_EX);
} elseif (is_readable($copia)) {
    readfile($copia);
    exit;
}

echo $xml;
