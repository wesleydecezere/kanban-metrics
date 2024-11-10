export {};

declare global {
  interface ReadonlyArray<T> {
    /**
     * Returns an array that contains all of the elements of this array that are
     * not `null` or `undefined`.
     *
     * @returns A new array with the results
     */
    filterNotNil(): Array<NonNullable<T>>;
  }

  interface Array<T> {
    /**
     * Returns an array that contains all of the elements of this array that are
     * not `null` or `undefined`.
     *
     * @returns A new array with the results
     */
    filterNotNil(): Array<NonNullable<T>>;
  }
}

if (!Array.prototype.filterNotNil) {
  Array.prototype.filterNotNil = function filterNotNill<T>(
    this: ReadonlyArray<T>
  ): Array<NonNullable<T>> {
    return this.reduce((memo, element) => {
      if (element !== null && typeof element !== "undefined") {
        memo.push(element as NonNullable<T>);
      }
      return memo;
    }, [] as Array<NonNullable<T>>);
  };
}
