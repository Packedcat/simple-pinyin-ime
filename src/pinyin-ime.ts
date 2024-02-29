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
interface Result {
  cadence: boolean
  word: string
  token: string
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
    const firstCandidate = {
      token: this.pinyin,
      word: tokens[0].map((i) => this.dict[i][0].w).join(''),
    }
    // collect first syllable of all tokens
    const firstSyllableSet = [...new Set(tokens.map((i) => i[0]))]
    // longer syllable is better
    firstSyllableSet.sort((a, b) => b.length - a.length)
    // project syllable to candidate
    const restCandidates = flatten(
      firstSyllableSet.map((s) => this.dict[s].map(({ w }) => ({ token: s, word: w }))),
    )
    this.syllableList = tokens[0]
    // deduplicate candidates
    this.candidates = [firstCandidate, ...restCandidates].reduce((acc, candidate) => {
      const existingIndex = acc.findIndex((c) => c.word === candidate.word)
      if (existingIndex === -1) {
        acc.push(candidate)
      } else if (candidate.token.length > acc[existingIndex].token.length) {
        // reserve the longest token
        acc[existingIndex] = candidate
      }
      return acc
    }, [] as Candidate[])
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
  pickCandidate(index: number): Result {
    const item = this.candidates.splice(index, 1)[0]
    if (!item) {
      throw new Error(`Miss candidate with index: ${index}`)
    }
    let cadence = false
    this.backStack.push(item)
    this.pinyin = this.pinyin.replace(item.token, '')
    const ret = this.backStack.reduce(
      (acc, item) => {
        acc.word += item.word
        acc.token += item.token
        return acc
      },
      { token: '', word: '' },
    )
    if (this.pinyin === '') {
      cadence = true
      this.backStack.length = 0
    }
    return { cadence, ...ret }
  }
}
