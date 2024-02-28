import { expect, it, describe } from '@jest/globals'
import { PinyinTokenizer } from './pinyin-tokenizer'
import { dict } from './dict'

const syllabary = new Set(Object.keys(dict))

describe('PinyinTokenizer', () => {
  it('should tokenize input string into array of arrays', () => {
    const tokenizer = new PinyinTokenizer(syllabary)
    expect(tokenizer.tokenize('nihaoma')).toEqual([
      ['n', 'i', 'h', 'a', 'o', 'm', 'a'],
      ['n', 'i', 'h', 'a', 'o', 'ma'],
      ['n', 'i', 'h', 'a', 'om', 'a'],
      ['n', 'i', 'h', 'ao', 'm', 'a'],
      ['n', 'i', 'h', 'ao', 'ma'],
      ['n', 'i', 'ha', 'o', 'm', 'a'],
      ['n', 'i', 'ha', 'o', 'ma'],
      ['n', 'i', 'ha', 'om', 'a'],
      ['n', 'i', 'hao', 'm', 'a'],
      ['n', 'i', 'hao', 'ma'],
      ['n', 'i', 'haoma'],
      ['ni', 'h', 'a', 'o', 'm', 'a'],
      ['ni', 'h', 'a', 'o', 'ma'],
      ['ni', 'h', 'a', 'om', 'a'],
      ['ni', 'h', 'ao', 'm', 'a'],
      ['ni', 'h', 'ao', 'ma'],
      ['ni', 'ha', 'o', 'm', 'a'],
      ['ni', 'ha', 'o', 'ma'],
      ['ni', 'ha', 'om', 'a'],
      ['ni', 'hao', 'm', 'a'],
      ['ni', 'hao', 'ma'],
      ['ni', 'haoma'],
      ['nihao', 'm', 'a'],
      ['nihao', 'ma'],
      ['nihaoma'],
    ])
  })

  it('should handle empty string', () => {
    const tokenizer = new PinyinTokenizer(syllabary)
    expect(tokenizer.tokenize('')).toEqual([[]])
  })
})
