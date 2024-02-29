import { PinyinTokenizer } from './pinyin-tokenizer'
import { flatten } from './utils'

interface Word {
  w: string
  f: number
}
interface Dict {
  [key: string]: Word[]
}
interface Candidate {
  token: string
  word: string
}

export class PinyinIME {
  private tokenizer: PinyinTokenizer
  private syllableList: string[] = []
  private backStack: Candidate[] = []
  private _pinyin = ''
  private get pinyin() {
    return this._pinyin
  }
  private set pinyin(char: string) {
    this._pinyin = char
    this.obtainCandidate()
  }
  candidates: Candidate[] = []
  get label() {
    return `${this.backStack.map(({ word }) => word).join('')}${this.syllableList.join(' ')}`
  }
  constructor(private dict: Dict) {
    this.tokenizer = new PinyinTokenizer(new Set(Object.keys(dict)))
  }
  private obtainCandidate() {
    if (this.pinyin.length === 0) {
      this.syllableList = []
      this.candidates = []
      return
    }
    const tokens = this.tokenizer.tokenize(this.pinyin)
    // fewer token is better
    tokens.sort((a, b) => a.length - b.length)
    // use all highest frequency word of token list to splice candidate
    const firstCandidate = tokens[0].map((i) => this.dict[i][0].w).join('')
    // collect first syllable of all tokens
    const firstSyllableSet = [...new Set(tokens.map((i) => i[0]))]
    // longer syllable is better
    firstSyllableSet.sort((a, b) => b.length - a.length)
    const restCandidates = flatten(
      firstSyllableSet
        .filter((e) => e !== this.pinyin) // deduplicate
        .map((s) => this.dict[s].map(({ w }) => ({ token: s, word: w }))),
    ).reduce((acc, candidate) => {
      const existingIndex = acc.findIndex((c) => c.word === candidate.word)
      if (existingIndex === -1) {
        acc.push(candidate)
      } else if (candidate.token.length > acc[existingIndex].token.length) {
        acc[existingIndex] = candidate
      }
      return acc
    }, [] as Candidate[])
    this.syllableList = tokens[0]
    this.candidates = [{ token: this.pinyin, word: firstCandidate }, ...restCandidates]
  }
  input(char: string) {
    this.pinyin += char
  }
  backspace() {
    if (this.backStack.length) {
      this.pinyin = `${this.backStack.pop()?.token ?? ''}${this.pinyin}`
    } else {
      this.pinyin = this.pinyin.substring(0, this.pinyin.length - 1)
    }
  }
  pickCandidate(index: number) {
    const item = this.candidates.splice(index, 1)[0]
    if (!item) return
    this.backStack.push(item)
    this.pinyin = this.pinyin.replace(item.token, '')
  }
}
