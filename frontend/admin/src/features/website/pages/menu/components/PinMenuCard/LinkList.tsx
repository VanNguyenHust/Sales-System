import styled from "@emotion/styled";
import { Button, Link } from "@/ui-components";
import { CloseSmallIcon } from "@/ui-icons";

import { SubjectLinkParentInfo } from "app/features/website/types";

interface Props {
  link: SubjectLinkParentInfo;
  index: number;
  onRemove: (index: number) => void;
}
export function LinkList({ link, index, onRemove }: Props) {
  return (
    <StyledLinkListContairer>
      <Link key={link.linklistRootId} url={`/admin/links/${link.linklistRootId}`} removeUnderline>
        {link.title}
      </Link>
      <Button
        plain
        icon={CloseSmallIcon}
        onClick={() => {
          onRemove(index);
        }}
      />
    </StyledLinkListContairer>
  );
}
const StyledLinkListContairer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing(2, 0)};
`;
