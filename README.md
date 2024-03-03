### Demo

This repo only implements the pinyin engine and does not have a virtual keyboard

![demo](sample.gif)

### How to build dict

1. download `rawdict_utf16_65105_freq.txt` from [PinyinIME archive](https://android.googlesource.com/platform/packages/inputmethods/PinyinIME/+archive/refs/heads/master.tar.gz)
2. extra `PinyinIME-refs_heads_main/jni/data/rawdict_utf16_65105_freq.txt` to scripts folder
3. convert encode to `UTF-8`

```shell
iconv -f UTF-16 -t UTF-8 rawdict_utf16_65105_freq.txt  > google_pinyin_rawdict_utf8_65105_freq.txt
```

4. build dict

```shell
node scripts/preprocess.mjs
```

### Dict structure

```javascript
const dict = {
  b: [
    { w: '菝', f: 2.53953332627 }, // ba
    { w: '柏', f: 794.770968525 }, // bai
  ],
  ba: [
    { w: '菝', f: 2.53953332627 },
    { w: '办案', f: 824.018360007 }, // ban'an
  ],
}
```

### Use

```typescript
// dict structure ⬆️
const ime = new PinyinIME(dict)
ime.input('nou')
// read this field to get all hanzi candidates
console.log(ime.candidates)
// read this field to get current hanzi&pinyin combo
console.log(ime.label)

const ret = ime.pickCandidate(0)
// pickCandidate will return the result
interface Result {
  cadence: boolean // true mean all pinyin has converted to hanzi
  word: string // current picked word
  token: string //current picked token
}
```

### Inspiration

https://leetcode.com/problems/word-break-ii/

https://github.com/dongyuwei/web-pinyin-ime
