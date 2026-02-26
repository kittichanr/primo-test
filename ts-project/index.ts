function merge(left: number[], right: number[]): number[] {
  var i = 0,
    j = 0,
    k = 0
  let result = []
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result[k++] = left[i++]
    else result[k++] = right[j++]
  }

  while (i < left.length) {
    result[k++] = left[i++]
  }

  while (j < right.length) {
    result[k++] = right[j++]
  }
  return result
}

function sortASC(arr: number[]): number[] {
  if (arr && arr.length < 2) {
    return arr
  }

  const mid = Math.floor(arr.length / 2)
  const pivot = arr[mid]

  let left = []
  let right = []
  for (let i = 0; i < arr.length; i++) {
    if (i != mid) {
      if (arr[i] <= pivot) {
        left.push(arr[i])
      } else if (arr[i] > pivot) {
        right.push(arr[i])
      }
    }
  }

  return sortASC(left).concat(pivot).concat(sortASC(right))
}

function mergeSort(
  collection1: number[],
  collection2: number[],
  collection3: number[],
): number[] {
  const newSortCollection1 = sortASC(collection1)

  const step1 = merge(collection2, collection3)
  const step2 = merge(newSortCollection1, step1)

  return step2
}

export { mergeSort }
