export interface TransactionModal {
  order_id: number;
  amount: number;
  kind: string;
  status: string;
  gateway: string;
  parent_id: number;
}

export interface Transactions extends TransactionModal {
  id: number;
}
export interface TransactionRequest extends TransactionModal {
  status: string;
}
// TODO: de-duplicate , clean hết các interface dùng chung 1 kiểu. VD: TransactionResponse=> Trasaction
export interface Transaction extends TransactionModal {
  id: number;
}
