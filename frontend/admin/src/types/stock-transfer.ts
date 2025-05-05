export const StockTransferStatus = {
  PENDING: "pending",
  RECEIVED: "received",
  TRANSFERRED: "transferred",
  CANCELLED: "cancelled",
  getName(name: string) {
    switch (name) {
      case this.PENDING:
        return "Chờ chuyển";
      case this.TRANSFERRED:
        return "Đang chuyển";
      case this.RECEIVED:
        return "Đã nhận";
      case this.CANCELLED:
        return "Đã hủy";
      default:
        return "";
    }
  },
};

export type StockTransferLineItemRequest = {
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  name: string | null;
  title: string | null;
  variant_title: string | null;
  sku: string | null;
  barcode: string | null;
  unit: string | null;
  ratio: number | null;
  transferred_quantity: number;
  transferred_price?: number;
  transferred_value?: number;
};

export type StockTransferCreateRequest = {
  code?: string | null;
  origin_location_id: number;
  destination_location_id: number;
  line_items: StockTransferLineItemRequest[];
  note?: string | null;
  tags?: string[] | null;
};

export type StockTransferLineItem = {
  id: number;
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  name: string;
  title: string;
  variant_title: string;
  unit: string;
  ratio: number;
  sku: string;
  barcode: string;
  transferred_quantity: number;
  transferred_price?: number;
  transferred_value?: number;
  created_on: string;
  updated_on: string;
};

export type StockTransfer = {
  id: number;
  store_id: number;
  code: string;
  status: "PENDING" | "TRANSFERRED" | "RECEIVED" | "CANCELLED";
  origin_location_id: number;
  destination_location_id: number;
  created_account_id: number;
  transferred_account_id: number;
  received_account_id: number;
  cancelled_account_id: number;
  total_transferred_value: number;
  created_on: string;
  updated_on: string;
  transferred_on: string;
  received_on: string;
  cancelled_on: string;
  tags: string[];
  note: string;
  line_items: StockTransferLineItem[];
};

export type StockTransferUpdateRequest = {
  id: number;
  origin_location_id?: number;
  destination_location_id?: number;
  line_items?: StockTransferLineItemRequest[];
  note?: string;
  tags?: string[];
};

export type StockTransfersResponse = {
  stock_transfers: StockTransfer[];
};

export type StockTransferResponse = {
  stock_transfer: StockTransfer;
};
