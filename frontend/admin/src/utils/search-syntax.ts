export type Comparator = "eq" | "ne" | "ge" | "gt" | "lt" | "le";

const comparators: Record<Exclude<Comparator, "ne">, string> = {
  eq: ":",
  ge: ":>=",
  gt: ":>",
  le: ":<=",
  lt: ":<",
};

class SearchSyntaxQueryBuilder {
  default: string | undefined;
  andClauses: string[];

  constructor() {
    this.default = "";
    this.andClauses = [];
  }

  /**
   * query that pass to default
   */
  query(value: string | undefined) {
    this.default = value;
    return this;
  }

  addFieldValue(name: string, value: string | number | boolean | null | undefined) {
    if (value !== null && value !== undefined) {
      this.andClauses.push(`${name}:${quoteValue(value)}`);
    }
    return this;
  }

  addFieldValues(name: string, values: string[] | number[]) {
    if (values.length) {
      this.andClauses.push(`(${values.map((value) => `${name}:${quoteValue(value)}`).join(" OR ")})`);
    }
    return this;
  }

  addFieldCommaValues(name: string, values: string[] | number[]) {
    if (values.length) {
      this.andClauses.push(
        `${name}:${quoteString(
          values
            .map((value) => (typeof value === "string" && value.indexOf(",") >= 0 ? quoteString(value) : value))
            .join(",")
        )}`
      );
    }
    return this;
  }

  addFieldCompare(name: string, value: string | number | null | undefined, op: Comparator = "eq") {
    if (value !== null && value !== undefined) {
      if (op === "ne") {
        this.andClauses.push(`-${name}:${quoteValue(value)}`);
      } else {
        this.andClauses.push(`${name}${comparators[op]}${quoteValue(value)}`);
      }
    }
    return this;
  }

  addFieldDateRange(
    name: string,
    value:
      | {
          start?: string;
          end?: string;
        }
      | null
      | undefined
  ) {
    if (value !== null && value !== undefined) {
      if (value.start) {
        this.andClauses.push(`${name}:>=${quoteValue(value.start)}`);
      }
      if (value.end) {
        this.andClauses.push(`${name}:<=${quoteValue(value.end)}`);
      }
    }
    return this;
  }

  build() {
    return [this.default, ...this.andClauses].filter(Boolean).join(" ");
  }
}

export function createSearchSyntax() {
  return new SearchSyntaxQueryBuilder();
}

function quoteValue(value: string | number | boolean) {
  return typeof value === "string" ? quoteString(value) : value;
}

function quoteString(value: string) {
  return `"${value.replaceAll('"', '\\"')}"`;
}
