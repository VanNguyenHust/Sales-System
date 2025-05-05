// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class CollectionUtils {
  static toPartitions = (size: number) => {
    return (resultArray: any, item: any, index: number) => {
      const chunkIndex = Math.floor(index / size);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray as any;
    };
  };
  static distint<T>(array: T[]): T[] {
    return array.filter(onlyUnique);
  }
}
export const onlyUnique = (value: any, index: number, array: any[]) => {
  return array.indexOf(value) === index;
};
