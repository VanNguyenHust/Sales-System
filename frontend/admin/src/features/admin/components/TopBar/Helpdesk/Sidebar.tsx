import { useRef } from "react";
import styled from "@emotion/styled";
import { Button, Spinner, Text } from "@/ui-components";
import { CloseBigIcon } from "@/ui-icons";

import { useToggle } from "app/utils/useToggle";

type Props = {
  onClose: () => void;
};

export const Sidebar = ({ onClose }: Props) => {
  const { value: isLoading, setFalse: setFalseLoading } = useToggle(true);
  const containerNode = useRef<HTMLDivElement>(null);
  const src = `https://support.sapo.vn/?view=webv3&url=${window.location.href}`;

  return (
    <StyledSidebar ref={containerNode}>
      <StyledWrapper>
        {isLoading && (
          <StyledLoading>
            <Spinner size="large" />
          </StyledLoading>
        )}
        <StyledHeading>
          <Text as="span" fontWeight="semibold" variant="bodyLg">
            Trợ giúp
          </Text>
          <Button plain icon={CloseBigIcon} onClick={onClose} />
        </StyledHeading>
        <iframe
          name="helpdesk-iframe"
          title="Trung tâm trợ giúp"
          src={src}
          onLoad={setFalseLoading}
          allow="clipboard-write; clipboard-read;"
        />
      </StyledWrapper>
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100vh;
  background-color: transparent;
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: ${(p) => p.theme.shadow.popover};
  background-color: ${(p) => p.theme.colors.surface};
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const StyledLoading = styled.div`
  position: absolute;
  background: ${(p) => p.theme.colors.surface};
  opacity: 0.4;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: none;
  }
`;

const StyledHeading = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
  background: linear-gradient(65.71deg, #0088ff 28.29%, #33a0ff 97.55%),
    linear-gradient(66deg, #08f 28.29%, #33a0ff 97.55%);
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(p) => p.theme.colors.surface};
  button {
    svg {
      fill: ${(p) => p.theme.colors.surface};
      color: ${(p) => p.theme.colors.surface};
    }
    &:hover,
    &:active {
      svg {
        fill: ${(p) => p.theme.colors.surface};
        color: ${(p) => p.theme.colors.surface};
        opacity: 0.7;
      }
    }
  }
`;
