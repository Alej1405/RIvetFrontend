/**
 * Verifica que package-lock.json esté completo, y opcionalmente lo repara.
 *
 * Por qué existe
 * --------------
 * El lock se genera en macOS y se consume en el Linux de GitHub Actions. Los
 * binarios nativos de este proyecto —oxlint, @tailwindcss/oxide y rolldown—
 * publican además un fallback a WebAssembly (`*-wasm32-wasi`), y esas ramas
 * dependen de @emnapi/*. npm en macOS no las resuelve porque aquí nunca las
 * instalaría, así que quedan fuera del lock. En el runner sí las resuelve y
 * `npm ci` corta con un EUSAGE que solo dice "Missing: X from lock file".
 *
 * Link Cargo no sufre esto porque compila con esbuild, que declara un binario
 * por plataforma como dependencia opcional explícita: npm las escribe todas.
 *
 * Uso
 * ---
 *   node scripts/verificar-lock.mjs              comprueba y sale con 1 si falta algo
 *   node scripts/verificar-lock.mjs --reparar    trae del registro lo que falte
 *
 * La reparación NO inventa nada: pide al registro de npm la versión exacta que
 * el árbol pide y copia su `resolved` e `integrity` tal cual.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const RUTA = new URL('../package-lock.json', import.meta.url)
const reparar = process.argv.includes('--reparar')

const lock = JSON.parse(readFileSync(RUTA, 'utf8'))
const paquetes = lock.packages

/** npm resuelve subiendo por los node_modules, igual que Node en ejecución. */
function resolver(desde, nombre) {
  let partes = desde.split('node_modules/').filter(Boolean)
  for (;;) {
    const base = partes.length > 1 ? partes.slice(0, -1).join('node_modules/') : ''
    const candidato = (base ? `${base}node_modules/${nombre}` : `node_modules/${nombre}`).replace('//', '/')
    if (paquetes[candidato]) return candidato
    if (partes.length <= 1) return null
    partes = partes.slice(0, -1)
  }
}

function huecos() {
  const encontrados = []
  for (const [clave, valor] of Object.entries(paquetes)) {
    if (!clave) continue
    const deps = { ...valor.dependencies, ...valor.optionalDependencies }
    for (const [dep, rango] of Object.entries(deps)) {
      if (!resolver(clave, dep)) encontrados.push({ padre: clave, dep, rango })
    }
  }
  return encontrados
}

/** Quita el prefijo del rango: solo se piden versiones exactas al registro. */
const versionExacta = (rango) => rango.replace(/^[\^~>=<\s]+/, '').split(' ')[0]

async function traerDelRegistro(nombre, version) {
  const r = await fetch(`https://registry.npmjs.org/${nombre}/${version}`)
  if (!r.ok) throw new Error(`el registro respondió ${r.status} para ${nombre}@${version}`)
  return r.json()
}

let pendientes = huecos()

if (pendientes.length === 0) {
  console.log(`El lock está completo: ${Object.keys(paquetes).length} paquetes, todas las dependencias resuelven.`)
  process.exit(0)
}

if (!reparar) {
  console.error(`\nEl lock tiene ${pendientes.length} dependencia(s) sin resolver.`)
  console.error('En este equipo npm ci pasa igual; en el Linux de Actions no.\n')
  for (const { padre, dep, rango } of pendientes) {
    console.error(`  ${dep}@${rango}  ← lo pide ${padre.split('node_modules/').pop()}`)
  }
  console.error('\nRepáralo con:  npm run lock:reparar   (y commitea el package-lock.json)\n')
  process.exit(1)
}

const añadidos = []
const vistos = new Set()

while (pendientes.length > 0) {
  const { dep, rango } = pendientes.shift()
  const clave = `node_modules/${dep}`
  if (paquetes[clave] || vistos.has(clave)) continue
  vistos.add(clave)

  const meta = await traerDelRegistro(dep, versionExacta(rango))
  paquetes[clave] = {
    version: meta.version,
    resolved: meta.dist.tarball,
    integrity: meta.dist.integrity,
    optional: true,
    ...(meta.dependencies ? { dependencies: meta.dependencies } : {}),
    ...(meta.engines ? { engines: meta.engines } : {}),
  }
  añadidos.push(`${dep}@${meta.version}`)
  // Lo que acaba de entrar puede pedir cosas que tampoco estén.
  pendientes = huecos()
}

// npm reescribe el archivo si las claves no van ordenadas.
lock.packages = Object.fromEntries(Object.entries(paquetes).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(RUTA, `${JSON.stringify(lock, null, 2)}\n`)

console.log(`Añadidos ${añadidos.length} paquete(s) con los datos del registro:`)
for (const a of añadidos) console.log(`  ${a}`)
console.log('\nCommitea el package-lock.json.')
