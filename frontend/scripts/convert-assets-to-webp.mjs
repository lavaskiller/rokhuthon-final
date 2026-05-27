import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = join(__dirname, '..', 'public', 'assets')

const pngs = readdirSync(ASSETS_DIR).filter(f => extname(f) === '.png')

for (const file of pngs) {
  const input = join(ASSETS_DIR, file)
  const output = join(ASSETS_DIR, basename(file, '.png') + '.webp')
  const beforeKB = Math.round(statSync(input).size / 1024)
  const info = await sharp(input).webp({ quality: 85 }).toFile(output)
  const afterKB = Math.round(info.size / 1024)
  console.log(`${file}: ${beforeKB}KB → ${afterKB}KB (${Math.round((1 - afterKB / beforeKB) * 100)}% 절감)`)
}
