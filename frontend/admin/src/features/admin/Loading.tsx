import { Avatar, Card } from "antd";

export function Loading() {
  return (
    <Card loading={true} style={{ minWidth: 300, minHeight: 300 }}>
      <Card.Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        }
        title="Card title"
        description={
          <>
            <p>This is the description</p>
            <p>This is the description</p>
          </>
        }
      />
    </Card>
  );
}
