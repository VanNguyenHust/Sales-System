import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Modal, Stack, Text } from "@/ui-components";
import { CircleCheckOutlineIcon } from "@/ui-icons";

type Props = {
  open: boolean;
  onClose(): void;
  heading: string;
  description?: React.ReactNode;
  /** @default 5 */
  delayCloseSeconds?: number;
};

export function ActionSuccessModal({ heading, description, delayCloseSeconds = 5, open, onClose }: Props) {
  const theme = useTheme();
  const timeRef = useRef<NodeJS.Timeout>();

  const clear = useCallback(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  }, []);

  const handleClose = () => {
    clear();
    onClose();
  };

  useEffect(() => {
    if (open && delayCloseSeconds > 0) {
      timeRef.current = setTimeout(onClose, delayCloseSeconds * 1000);
    }
    return clear;
  }, [clear, delayCloseSeconds, onClose, open]);

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledWrapper onClick={clear}>
        <Stack distribution="fill" spacing="baseTight">
          <CircleCheckOutlineIcon width={24} height={24} color={theme.colors.textSuccess} />
          <Text as="h2" variant="headingLg">
            {heading}
          </Text>
        </Stack>
        {description ? (
          <Text as="p" alignment="center">
            {description}
          </Text>
        ) : null}
      </StyledWrapper>
    </Modal>
  );
}

const StyledWrapper = styled.div`
  padding: ${(p) => p.theme.spacing(6, 0)};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(2)};
  align-items: center;
  justify-content: center;
`;
