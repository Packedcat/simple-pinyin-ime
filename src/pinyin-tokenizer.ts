export class PinyinTokenizer {
  private memoMap = new Map<number, string[][]>()
  constructor(private syllabary: Set<string>) {}
  private backtrack(str: string, index: number) {
    // pruning
    if (this.memoMap.has(index)) {
      return this.memoMap.get(index)!
    }
    const ret: string[][] = []
    // avoid overflow
    if (index === str.length) {
      ret.push([])
    }
    for (let i = index + 1; i <= str.length; i++) {
      const segment = str.substring(index, i)
      if (this.syllabary.has(segment)) {
        const restRet = this.backtrack(str, i)
        for (const item of restRet) {
          ret.push([segment, ...item])
        }
      }
    }
    this.memoMap.set(index, ret)
    return ret
  }
  tokenize(input: string) {
    this.memoMap.clear()
    return this.backtrack(input, 0)
  }
}
