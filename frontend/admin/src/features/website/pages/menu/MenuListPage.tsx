import styled from "@emotion/styled";
import { Card, IndexTable, Link, Loading, Page } from "@/ui-components";
import { Link02Icon, PlusCircleOutlineIcon } from "@/ui-icons";

import { DocumentTitle } from "app/components/DocumentTitle";
import { FooterHelp } from "app/components/FooterHelp";

import { MenuListSkeleton } from "./components/MenuListSkeleton";
import { useGetLinklistsQuery } from "./api";

export default function MenuListPage() {
  const {
    data: linklists,
    isLoading: isLoadingLinklists,
    isFetching: isFetchingLinklists,
  } = useGetLinklistsQuery(undefined, { refetchOnMountOrArgChange: true });

  const rowMarkup = linklists?.map((item, index) => {
    return (
      <IndexTable.Row id={item.id.toString()} key={item.id.toString()} position={index}>
        <IndexTable.Cell>
          <StyledCell>
            <Link removeUnderline url={`/admin/links/${item.id}`}>
              {item.title}
            </Link>
          </StyledCell>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <StyledCell>{item.links.flatMap((item) => item.title).join(", ")}</StyledCell>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  if (isLoadingLinklists) {
    return <MenuListSkeleton />;
  }

  return (
    <Page
      title="Menu"
      primaryAction={{
        content: "Thêm menu",
        icon: PlusCircleOutlineIcon,
        url: "/admin/links/create",
      }}
      secondaryActions={[{ icon: Link02Icon, url: "/admin/redirects", content: "Chuyển hướng 301" }]}
    >
      {isFetchingLinklists ? <Loading /> : null}
      <DocumentTitle title="Menu" />
      <Card title="Danh sách menu">
        <Card.Section>
          Menu và liên kết giúp khách hàng điều hướng trên website của bạn dễ dàng hơn. Bạn có thể tùy chỉnh hiển thị
          các menu mới cho giao diện của mình thông qua{" "}
          <Link url="/admin/themes" removeUnderline>
            chỉnh sửa giao diện
          </Link>
        </Card.Section>
        <IndexTable
          loading={isFetchingLinklists}
          itemCount={(linklists || []).length}
          selectable={false}
          headings={[
            {
              id: "name",
              title: "Tên menu",
            },
            {
              id: "link",
              title: "Liên kết",
            },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
      <FooterHelp resource="menu" url="https://help.sapo.vn/tim-hieu-ve-menu" external />
    </Page>
  );
}

const StyledCell = styled.div`
  white-space: normal;
  padding: ${(p) => p.theme.spacing(2, 0)};
`;
