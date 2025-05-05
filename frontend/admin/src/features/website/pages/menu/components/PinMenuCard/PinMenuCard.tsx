import styled from "@emotion/styled";
import { Card, Modal } from "@/ui-components";

import { useGetLinklistsQuery } from "app/features/website/pages/menu/api";
import { SubjectLinkParentInfo } from "app/features/website/types";
import { useToggle } from "app/utils/useToggle";

import { LinkList } from "./LinkList";
import RowMenuItem from "./RowMenuItem";

interface Props {
  description?: string;
  onChange: (linkListSubParent: SubjectLinkParentInfo[]) => void;
  linkListSubParent: SubjectLinkParentInfo[];
}

export const PinMenuCard = ({ description, onChange, linkListSubParent }: Props) => {
  const {
    value: openModalMenuAction,
    setTrue: toggleOpenModalMenuAction,
    setFalse: toggleCloseModalMenuAction,
  } = useToggle(false);

  const { data: linklists, isFetching: isFetchingLinklists } = useGetLinklistsQuery(undefined, {
    skip: !openModalMenuAction,
  });

  return (
    <Card
      title="Gắn lên menu"
      actions={[
        {
          content: "Chọn menu",
          onAction: toggleOpenModalMenuAction,
        },
      ]}
    >
      <StyledTagsSelector>
        {linkListSubParent.length > 0
          ? linkListSubParent.map((l, index) => (
              <LinkList
                link={l}
                index={index}
                key={l.linklistRootId}
                onRemove={(index) => {
                  const newList = [...linkListSubParent];
                  newList.splice(index, 1);
                  onChange(newList);
                }}
              />
            ))
          : description || "Thêm vào menu trên website của bạn"}
      </StyledTagsSelector>
      {openModalMenuAction ? (
        <Modal loading={isFetchingLinklists} open title="Chọn menu" onClose={toggleCloseModalMenuAction}>
          <StyledLinkContainer>
            {(linklists || []).map((link) => {
              return (
                <RowMenuItem
                  isParent
                  linkList={link}
                  key={link.id}
                  level={0}
                  onAddMenu={(linkAdd) => {
                    if (
                      !linkListSubParent.find(
                        (parent) =>
                          parent.linkParentId === linkAdd.linkParentId &&
                          linkAdd.linklistRootId === parent.linklistRootId
                      )
                    ) {
                      onChange([...linkListSubParent, linkAdd]);
                      toggleCloseModalMenuAction();
                    }
                  }}
                  isOpen
                />
              );
            })}
          </StyledLinkContainer>
        </Modal>
      ) : null}
    </Card>
  );
};

const StyledLinkContainer = styled.div`
  padding: ${(p) => p.theme.spacing(4, 5)};
`;

const StyledTagsSelector = styled.div`
  padding: ${(p) => p.theme.spacing(4, 5, 4)};
  & > div:not(:last-child) {
    border-bottom: ${(p) => p.theme.shape.borderDivider};
  }
`;
