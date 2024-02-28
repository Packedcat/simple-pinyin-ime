import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const separator = ' 0 '
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rawDictPath = path.resolve(__dirname, 'google_pinyin_rawdict_utf8_65105_freq.txt')
const dictPath = path.resolve(__dirname, '../src/dict.ts')
const googlePinyin = fs.readFileSync(rawDictPath, 'utf-8')

// the line include ' 0 ' means simplified chinese characters', while ' 1 ' means traditional chinese characters.
const lines = googlePinyin.split('\n').filter((line) => line.includes(' 0 '))

const dict = lines.reduce((accumulator, line) => {
  const arr = line.split(separator)
  const [word, frequency] = arr[0].split(' ')
  const pinyin = arr[1].replace(/\s/g, '')
  // abbr is the first chars of the pinyin
  const abbr = arr[1]
    .split(' ')
    .map((item) => item.substring(0, 1))
    .join('')
  const value = { w: word, f: parseFloat(frequency) }
  accumulator[pinyin] = accumulator[pinyin] || []
  accumulator[pinyin].push(value)
  // make pinyin prefix input can index word
  accumulator[abbr] = accumulator[abbr] || []
  accumulator[abbr].push(value)
  return accumulator
}, {})

// make iuv indexable
dict['i'] = [{ w: 'i', f: 0 }]
dict['u'] = [{ w: 'u', f: 0 }]
dict['v'] = [{ w: 'v', f: 0 }]

// sort all word by frequency
Object.values(dict).forEach((i) => i.sort((a, b) => b.f - a.f))

const content = `export const dict = ${JSON.stringify(dict)}`

fs.writeFileSync(dictPath, content, 'utf-8')
