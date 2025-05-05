export const filterNonNull = <T>(items: (T | null)[]) => items.filter((item): item is T => item !== null);
