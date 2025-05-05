import { useCallback, useMemo, useRef } from "react";
import { type Blocker } from "react-router-dom";
import { Text } from "@/ui-components";

import { useToggle } from "app/utils/useToggle";

import { ConfirmModal } from "../ConfirmModal";

import { LeavePageContext } from "./context";

interface Props {
  children: React.ReactNode;
}

export function LeavePageProvider({ children }: Props) {
  const { value: blocked, setTrue: setBlockedTrue, setFalse: setBlockedFalse } = useToggle(false);
  const blockerRef = useRef<Blocker>();

  const setBlocker = useCallback(
    (blocker?: Blocker) => {
      blockerRef.current = blocker;
      if (blocker?.state === "blocked") {
        setBlockedTrue();
      } else {
        setBlockedFalse();
      }
    },
    [setBlockedFalse, setBlockedTrue]
  );

  const handleConfirm = () => {
    setBlockedFalse();
    blockerRef.current?.proceed?.();
  };

  const leavePageMarkup = blocked ? (
    <ConfirmModal
      open
      onDismiss={blockerRef.current?.reset ?? noop}
      title="Rời khỏi trang"
      confirmAction={{
        content: "Rời khỏi trang này",
        destructive: true,
        onAction: handleConfirm,
      }}
      body={
        <Text as="p" fontWeight="regular">
          Nếu bạn rời khỏi trang này, tất cả thay đổi chưa lưu sẽ bị mất. Bạn có chắc chắn muốn rời khỏi trang này?
        </Text>
      }
    />
  ) : null;

  const context = useMemo(
    () => ({
      setBlocker,
    }),
    [setBlocker]
  );

  return (
    <LeavePageContext.Provider value={context}>
      {leavePageMarkup}
      {children}
    </LeavePageContext.Provider>
  );
}

function noop() {}
