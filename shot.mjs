import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:5173/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForSelector('h1', { timeout: 20000 }).catch(() => {})
await page.waitForTimeout(1800)
await page.screenshot({ path: '/tmp/shot-top.png' })
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'instant' }))
await page.waitForTimeout(1200)
await page.screenshot({ path: '/tmp/shot-mid.png' })
await page.screenshot({ path: '/tmp/shot-full.png', fullPage: true })
await browser.close()
console.log('screenshots listos')
