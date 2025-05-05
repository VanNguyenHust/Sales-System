import { useEffect } from "react";

import { DocumentTitle } from "app/components/DocumentTitle";
import { Loading } from "app/components/Loading";

export function PosPage() {
  useEffect(() => {
    window.location.reload();
  }, []);
  return (
    <>
      <DocumentTitle title="POS" />
      <Loading />
    </>
  );
}
