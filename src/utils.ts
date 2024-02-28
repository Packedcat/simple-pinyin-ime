export function flatten<T>(arr: (T | T[])[]): T[] {
  let result: T[] = []

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item))
    } else {
      result.push(item as T)
    }
  })

  return result
}
