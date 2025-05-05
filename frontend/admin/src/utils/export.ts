type Column = {
  requiresReadCostPricePerm?: boolean;
};
type Group = {
  columns: Column[];
};

export function withoutReadCostPriceExport<T extends Group>(groups?: T[]): T[] {
  return (groups || []).map((group) => ({
    ...group,
    columns: group.columns.filter((col) => !col.requiresReadCostPricePerm),
  }));
}
