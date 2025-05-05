export interface ArrayComparator<T> {
  (firstArray: T, SecondArray: T): boolean;
}

export function arraysAreEqual<T>(
  firstArray: T[],
  secondArray: T[],
  comparator: ArrayComparator<T> = (a, b) => a === b
) {
  return firstArray.length === secondArray.length && firstArray.every((item, i) => comparator(item, secondArray[i]));
}
