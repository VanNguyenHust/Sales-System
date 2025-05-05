import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";

import { useToggle } from "./useToggle";

export function useQueryAndPaging() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, { isPending: isPendingTag }] = useDebounce(query, 300);
  const queryPending = isPendingTag();
  const [page, setPage] = useState(1);
  const [touched, setTouched] = useState(false);
  const { value: isSwitching, setFalse: setSwitchingComplete, setTrue: setSwitching } = useToggle(false);

  const handleChangePage: typeof setPage = useCallback(
    (arg) => {
      setPage(arg);
      setSwitching();
    },
    [setSwitching]
  );

  const handleChangeQuery = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  return {
    touched,
    setTouched: useCallback(() => setTouched(true), []),
    page,
    isSwitching,
    setSwitchingComplete,
    setPage: handleChangePage,
    query,
    debouncedQuery,
    queryPending,
    changeQuery: useCallback(handleChangeQuery, []),
  };
}
