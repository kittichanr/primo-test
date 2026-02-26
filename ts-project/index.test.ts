import { mergeSort } from "./index"

describe("test mergeSort function", () => {
  test("should mergeSort correctly", () => {
    const collection1 = [10, 8, 6, 4, 2]
    const collection2 = [1, 3, 5, 7, 9]
    const collection3 = [0, 2, 4, 6, 8]

    const result = [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10]
    expect(mergeSort(collection1, collection2, collection3)).toEqual(result)
  })
})
