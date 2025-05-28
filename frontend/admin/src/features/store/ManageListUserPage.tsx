import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Input,
  List,
  Progress,
  Typography,
} from "antd";
import {
  useDeleteUserMutation,
  useDisableUserMutation,
  useEnableUserMutation,
  useGetUsersQuery,
} from "./api";
import { useMemo, useState } from "react";
import { Loading } from "../admin/Loading";
import { useSelector } from "react-redux";
import { isClientError, StoreInfoState } from "@/client";
import { randomAvatarIndex } from "@/assets/images/avatar";
import { Link } from "react-router-dom";
import CustomTag from "@/components/tag/CustomTag";
import CustomLink from "@/components/CustomLink";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useToast } from "@/components/Toast";

type InfoAccountProps = {
  id: number;
  avatar: string;
  fullName: string;
  email?: string;
  userType?: string;
  active?: boolean;
};

export default function ManageListUserPage() {
  const { showToast } = useToast();
  const [queryUsers, setQueryUsers] = useState("");
  const [itemSelected, setItemSelected] = useState<number[]>([]);
  const { maxUser } = useSelector((state: StoreInfoState) => state.storeInfo);

  const [enableUser] = useEnableUserMutation();
  const [disableUser] = useDisableUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleActionUsers = async (action: string) => {
    const actionLabel =
      action === "enable"
        ? "Kích hoạt"
        : action === "disable"
        ? "Ngừng kích hoạt"
        : "Xóa tài khoản";
    try {
      action === "enable"
        ? await enableUser({ userIds: itemSelected })
        : action === "disable"
        ? await disableUser({ userIds: itemSelected })
        : await deleteUser({ userIds: itemSelected });

      showToast({
        type: "success",
        message: `${actionLabel} tài khoản thành công`,
      });
      setItemSelected([]);
    } catch (error) {
      if (isClientError(error)) {
        showToast({
          type: "error",
          message: `${actionLabel} tài khoản thất bại`,
          description: error.data.errors
            .map((error) => error.message)
            .join(", "),
        });
      }
    }
  };

  const {
    data: usersWithCount,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useGetUsersQuery();

  const { ownerAccount, staffAccounts, activeAccount } = useMemo(() => {
    const ownerAccount = usersWithCount?.users.filter(
      (user) => user.accountOwner === true
    )[0];
    const staffAccounts = usersWithCount?.users.filter(
      (user) => user.accountOwner === false
    );
    const activeAccount = usersWithCount?.users.filter(
      (user) => user.active === true
    ).length;
    return { ownerAccount, staffAccounts, activeAccount };
  }, [usersWithCount]);

  const InfoAccount = ({
    id,
    avatar,
    fullName,
    email,
    userType,
    active = true,
  }: InfoAccountProps) => {
    return (
      <StyledInfoAccount>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Avatar src={avatar} size={34} />
          <StyledInfo>
            <Link to={`/admin/users/${id}`}>
              <Button color="primary" variant="link" style={{ padding: 0 }}>
                {fullName}
              </Button>
            </Link>
            <Typography.Text type="secondary">{email}</Typography.Text>
          </StyledInfo>
        </div>
        {userType === "invited" ? (
          <CustomTag color="blue">Đã mời</CustomTag>
        ) : active ? (
          <CustomTag color="green">Đang kích hoạt</CustomTag>
        ) : (
          <CustomTag color="red">Ngừng kích hoạt</CustomTag>
        )}
        {}
      </StyledInfoAccount>
    );
  };

  if (isLoadingUsers) {
    return <Loading />;
  }

  return (
    <StyledContainer>
      <Card title="Tổng quan tài khoản">
        <StyledCountAccount>
          <Typography.Text>Tài khoản đang kích hoạt</Typography.Text>
          <Typography.Text>{activeAccount}</Typography.Text>
        </StyledCountAccount>
        <StyledCountAccount>
          <Typography.Text>Tài khoản được kích hoạt tối đa</Typography.Text>
          <Typography.Text>{maxUser}</Typography.Text>
        </StyledCountAccount>
      </Card>
      <Card title="Tài khoản chủ cửa hàng">
        <StyledCountAccount>
          <InfoAccount
            id={ownerAccount?.id || 0}
            avatar={randomAvatarIndex}
            fullName={`${ownerAccount?.firstName} ${ownerAccount?.lastName}`}
            email={ownerAccount?.email}
            active={ownerAccount?.active}
          />
        </StyledCountAccount>
      </Card>
      <Card
        title="Tài khoản nhân viên"
        extra={
          <CustomLink to="/admin/users/create">
            <PlusCircleOutlined /> Thêm mới nhân viên
          </CustomLink>
        }
      >
        <Input.Search
          placeholder="Tìm kiếm tài khoản nhân viên"
          allowClear
          enterButton
          size="middle"
          onSearch={(value) => setQueryUsers(value)}
        />
        <StyledTitleList>
          <Checkbox
            checked={
              itemSelected.length > 0 &&
              itemSelected.length === staffAccounts?.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setItemSelected(staffAccounts?.map((item) => item.id) || []);
              } else {
                setItemSelected([]);
              }
            }}
          />
          <Typography.Title level={5} style={{ margin: 0 }}>
            Tài khoản nhân viên
          </Typography.Title>
          {itemSelected?.length > 0 && (
            <>
              <Button type="link" onClick={() => handleActionUsers("enable")}>
                Kích hoạt
              </Button>
              <Button type="link" onClick={() => handleActionUsers("disable")}>
                Ngừng kích hoạt
              </Button>
              <Button type="link" onClick={() => handleActionUsers("delete")}>
                Xóa tài khoản
              </Button>
            </>
          )}
        </StyledTitleList>
        <List
          itemLayout="horizontal"
          dataSource={staffAccounts}
          loading={isFetchingUsers}
          renderItem={(item) => (
            <List.Item>
              <Checkbox
                checked={itemSelected.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setItemSelected((prev) => [...prev, item.id]);
                  } else {
                    setItemSelected((prev) =>
                      prev.filter((id) => id !== item.id)
                    );
                  }
                }}
                style={{ marginRight: 16 }}
              />
              <InfoAccount
                id={item.id}
                avatar={randomAvatarIndex}
                fullName={`${item.firstName} ${item.lastName}`}
                email={item.email}
                userType={item.userType}
                active={item.active}
              />
            </List.Item>
          )}
          pagination={
            staffAccounts && staffAccounts.length > 0
              ? {
                  current: 1,
                  pageSize: maxUser,
                  total: staffAccounts.length,
                  showSizeChanger: false,
                  onChange: (page, pageSize) => {
                    setQueryUsers("");
                  },
                }
              : false
          }
        />
      </Card>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledCountAccount = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledInfoAccount = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTitleList = styled.div`
  display: flex;
  gap: 16px;
  height: 40px;
  margin-top: 16px;
  justify-content: start;
  align-items: center;
  background-color: #f4f6f8;
`;
