type GetRangeProps = {
  start: number;
  end?: number;
  length?: number;
  step?: number;
};

declare global {
  interface Array<T> {
    remove(element: T[]): T[];
    sortAsc(): T[];
    sortDesc(): T[];
    first(): T;
    last(): T;
    partition(size: number): T[][];
  }
}

Array.prototype.remove = function <T>(
  this: T[],
  elements: T[] | undefined
): T[] {
  return this.filter((element) => !elements?.includes(element));
};

Array.prototype.sortAsc = function <T extends number>(this: T[]): T[] {
  return this.sort((a, b) => a - b);
};

Array.prototype.sortDesc = function <T extends number>(this: T[]): T[] {
  return this.sort((a, b) => b - a);
};

Array.prototype.first = function <T>(this: T[]): T {
  return this[0];
};

Array.prototype.last = function <T>(this: T[]): T {
  return this[this.length - 1];
};

Array.prototype.partition = function <T>(this: T[], size: number): T[][] {
  return partition(this, size);
};

export function getRange({ start, end, length }: GetRangeProps): number[] {
  const hasEnd = end !== undefined;
  const hasLength = length !== undefined;

  if ((hasEnd && hasLength) || (!hasEnd && !hasLength)) return [];

  if (hasEnd) {
    return Array.from({ length: end! - start + 1 }, (_, i) => start + i);
  }

  return Array.from({ length: length! }, (_, i) => start + i);
}

function partition<T>(array: T[], size: number): T[][] {
  return array.reduce((acc, _, idx) => {
    if (idx % size === 0) {
      acc.push(array.slice(idx, idx + size));
    }

    return acc;
  }, Array<T[]>());
}
