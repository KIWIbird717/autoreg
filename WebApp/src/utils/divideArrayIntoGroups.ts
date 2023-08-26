
export type ArrayIntoGroupsType<T> = T[][]

/**
 * Divides an array into groups of a specified size.
 * @param array The array to divide into groups.
 * @param groupSize The size of each group.
 * @returns An array of groups, where each group is an array of items of the specified size.
 * 
 * Input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]        
 * Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 */
export const divideArrayIntoGroups = <T>(array: T[], groupSize: number): ArrayIntoGroupsType<T> => {
  const groups: ArrayIntoGroupsType<T> = [] // create an empty array to hold the groups

  array.forEach((_, index) => {
    if (index % groupSize === 0) {
      groups.push(array.slice(index, index + groupSize));
    }
  });
  
  return groups 
}
