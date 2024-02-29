import { expect, it, describe } from '@jest/globals'
import { PinyinIME } from './pinyin-ime'
import { dict } from './dict'

describe('PinyinIME', () => {
  it('should candidates computed correct after picked', () => {
    const ime = new PinyinIME(dict)
    ime.input('nou')
    ime.pickCandidate(1)
    expect(ime.label).toEqual('你哦u')
    expect(ime.candidates).toEqual([{ token: 'u', word: 'u' }])
  })
  it('should label computed correct after picked', () => {
    const ime = new PinyinIME(dict)
    ime.input('ouzhoushichang')
    ime.pickCandidate(1)
    expect(ime.label).toEqual('欧洲shichang')
  })
  it('should backspace can restore picked', () => {
    const ime = new PinyinIME(dict)
    ime.input('ouzhoushichang')
    ime.pickCandidate(1)
    ime.backspace()
    expect(ime.candidates).toEqual([
      { token: 'ouzhoushichang', word: '欧洲市场' },
      { token: 'ouzhou', word: '欧洲' },
      { token: 'ou', word: '偶' },
      { token: 'ou', word: '欧' },
      { token: 'ou', word: '藕' },
      { token: 'ou', word: '呕' },
      { token: 'ou', word: '鸥' },
      { token: 'ou', word: '殴' },
      { token: 'ou', word: '耦' },
      { token: 'ou', word: '瓯' },
      { token: 'ou', word: '沤' },
      { token: 'ou', word: '区' },
      { token: 'ou', word: '怄' },
      { token: 'ou', word: '讴' },
      { token: 'o', word: '哦' },
      { token: 'o', word: '噢' },
      { token: 'o', word: '喔' },
    ])
    expect(ime.label).toEqual('ouzhoushichang')
  })
})
