import styled from "@emotion/styled";
import { Modal, type ModalProps, Scrollable, Spinner, useBreakpoints } from "@/ui-components";

import { EmptySearchResult } from "./EmptySearchResult";
import { IndexTable } from "./IndexTable";

type Props = Without<ModalProps, "noScroll"> & {
  searchField: React.ReactElement;
  /**
   * @default "medium"
   */
  size?: "medium" | "large";
};

export const ResourceModal: React.FC<Props> & {
  EmptySearchResult: typeof EmptySearchResult;
  IndexTable: typeof IndexTable;
} = ({ searchField, children, size = "medium", loading, sectioned, onScrolledToBottom, ...modalProps }: Props) => {
  const { mdUp } = useBreakpoints();
  return (
    <Modal {...modalProps} noScroll size={size === "large" && mdUp ? "large" : "fullScreen"}>
      <StyledContainer>
        <StyledSearchFieldContainer>{searchField}</StyledSearchFieldContainer>
        <StyledScrollable onScrolledToBottom={onScrolledToBottom}>
          {loading ? (
            <StyledLoading>
              <Spinner size="large" />
            </StyledLoading>
          ) : sectioned ? (
            <StyledSection>{children}</StyledSection>
          ) : (
            children
          )}
        </StyledScrollable>
      </StyledContainer>
    </Modal>
  );
};

ResourceModal.EmptySearchResult = EmptySearchResult;
ResourceModal.IndexTable = IndexTable;

const StyledContainer = styled.div`
  --header-container-height: 53px;
  --footer-container-height: 77px;
  --search-field-container-height: 61px;
  --total-container-height: calc(
    var(--header-container-height) + var(--search-field-container-height) + var(--footer-container-height)
  );
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

const StyledSearchFieldContainer = styled.div`
  padding: ${(p) => p.theme.spacing(3, 4)};
  border-bottom: ${(p) => p.theme.shape.borderDivider};
`;

const StyledScrollable = styled(Scrollable)`
  height: calc(100dvh - var(--total-container-height));
  max-height: calc(100dvh - var(--total-container-height));
  min-height: calc(100dvh - var(--total-container-height));

  @media (min-width: 48em) {
    height: calc(100vh - 20rem);
    max-height: calc(100vh - 20rem);
    min-height: unset;
  }

  @media ((min-width: 48em) and (max-height: 45em)) {
    height: calc(100vh - 15rem);
    max-height: calc(100vh - 15rem);
    min-height: unset;
  }
`;

const StyledLoading = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StyledSection = styled.div`
  padding: ${(p) => p.theme.spacing(3, 4)};
  height: 100%;
`;
