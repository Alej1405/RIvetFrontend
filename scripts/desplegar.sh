#!/usr/bin/env bash
# Despliegue de rivet-ec.com en el cPanel.
#
# El servidor no ejecuta Node: recibe el bundle ya compilado. Los meta tags y
# el sitemap NO se generan aquí: los arma public/seo.php y public/sitemap.php
# en el servidor, pidiéndole los datos al ERP en el momento. Por eso un
# producto o una noticia que el cliente publique hoy se comparte bien hoy, sin
# que nadie despliegue nada.
#
# Ese par de scripts necesita ~/rivet-seo-config.php (fuera de public_html,
# fuera del repositorio) con el token del ERP. Si falta, el sitio funciona
# igual pero se comparte con la tarjeta genérica.
#
# Se excluye .well-known porque ahí viven las validaciones de certificado del
# hosting: borrarlo con --delete tumba el HTTPS hasta la siguiente renovación.
set -euo pipefail

VPS="${VPS:-linkcargo}"
DESTINO="${DESTINO:-public_html}"

echo "→ compilando"
npm run build

echo "→ subiendo a $VPS:$DESTINO"
rsync -az --delete \
  --exclude '.well-known' \
  --exclude 'cgi-bin' \
  dist/ "$VPS:$DESTINO/"

echo "→ comprobación"
for ruta in / /catalogo /blog /sitemap.xml /robots.txt; do
  printf "  %-14s → %s\n" "$ruta" "$(curl -s -o /dev/null -w '%{http_code}' "https://rivet-ec.com$ruta")"
done

# ── El SEO dinámico, comprobado de verdad ────────────────────────────────────
#
# Esto no es decoración del despliegue: es la única forma de enterarse de que
# el SEO se apagó. Si alguien borra ~/rivet-seo-config.php, si el token del
# ERP caduca o si el ERP deja de responder, seo.php degrada en silencio y
# sirve el index.html genérico. El sitio se ve perfecto, todo responde 200, y
# mientras tanto cada producto que se comparte sale con la tarjeta de la
# portada. Sin esta comprobación nos enteraríamos cuando lo note el cliente.
#
# Las sondas son un producto y una noticia, NO /catalogo ni /blog: esas dos
# arman su título sin preguntarle nada al ERP ("Catálogo · RIVET Ecuador"), así
# que salen en verde aunque el SEO esté muerto. Comprobado apagándolo a
# propósito: las dos pasaron y solo cantaron el producto y el sitemap.
#
# Y los slugs salen del sitemap, no escritos aquí: un producto se puede
# despublicar cualquier día y la comprobación quedaría alarmando por un
# producto que ya no existe.
GENERICO='RIVET Ecuador — Ingeniería Alimentaria'
fallos=0

titulo_de() {
  curl -s --max-time 20 -A 'WhatsApp/2.23' "https://rivet-ec.com$1" \
    | { grep -oE '<meta property="og:title" content="[^"]*' || true; } \
    | sed 's/.*content="//' \
    | head -1
}

probar() {
  local ruta="$1" titulo
  titulo="$(titulo_de "$ruta")"

  if [ -z "$titulo" ] || [ "$titulo" = "$GENERICO" ]; then
    printf "  ✗ %-30s SIN meta tags propios\n" "$ruta"
    fallos=$((fallos + 1))
  else
    printf "  ✓ %-30s %s\n" "$ruta" "$titulo"
  fi
}

echo "→ el sitemap"

sitemap="$(curl -s --max-time 30 https://rivet-ec.com/sitemap.xml)"
contar() {
  # `|| true` en cada uno: sin coincidencias, grep sale con 1 y `pipefail`
  # tumbaría el script justo cuando hay algo que reportar.
  printf '%s' "$sitemap" | { grep -coE "$1" || true; } | tr -d ' '
}

urls="$(contar '<loc>')"
productos="$(contar '<loc>[^<]*/producto/')"
noticias="$(contar '<loc>[^<]*/blog/')"

if [ "${productos:-0}" -lt 1 ] || [ "${noticias:-0}" -lt 1 ]; then
  printf "  ✗ %-30s %s URLs · %s productos · %s noticias\n" "/sitemap.xml" "$urls" "$productos" "$noticias"
  fallos=$((fallos + 1))
else
  printf "  ✓ %-30s %s URLs · %s productos · %s noticias\n" "/sitemap.xml" "$urls" "$productos" "$noticias"
fi

echo "→ lo que ve WhatsApp"

# Una ruta real de cada tipo, tomada del propio sitemap.
for tipo in producto blog; do
  ruta="$(printf '%s' "$sitemap" \
    | { grep -oE "<loc>https://rivet-ec\.com/$tipo/[^<]+" || true; } \
    | head -1 \
    | sed 's#<loc>https://rivet-ec\.com##')"

  if [ -n "$ruta" ]; then
    probar "$ruta"
  else
    printf "  ✗ %-30s no hay ninguna en el sitemap\n" "/$tipo/…"
    fallos=$((fallos + 1))
  fi
done

if [ "$fallos" -gt 0 ]; then
  cat <<'AVISO'

  ⚠  EL SEO DINÁMICO NO ESTÁ RESPONDIENDO

  El sitio funciona, pero lo que se comparta por WhatsApp o Facebook va a
  salir con el título y la imagen de la portada. Revisa, en este orden:

    1. ssh linkcargo 'ls -l ~/rivet-seo-config.php'
       Tiene que existir, fuera de public_html. El rsync no lo toca, pero
       una limpieza manual del home sí se lo lleva por delante.

    2. ssh linkcargo 'php -r "\$c = require getenv(\"HOME\").\"/rivet-seo-config.php\"; echo strlen(\$c[\"token\"]);"'
       Si imprime 0, el token está vacío.

    3. Probar el ERP con ese token:
       curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer <token>" \
         https://erp.mashaec.net/api/ecommerce/rivet-ecuador-sas/categories
       Un 401 es token caducado; un 500, el ERP caído.

AVISO
  exit 1
fi

echo
echo "  Todo en orden: los meta tags salen del ERP en vivo."
