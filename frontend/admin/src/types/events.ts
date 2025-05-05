import { TextDateTransfer } from "app/components/DateTimeField";

export type OrderEvent = EventResponse;

export const eventVerb = {
  PLACED: "placed",
  SALE_PENDING: "sale_pending",
  SALE_FAILURE: "sale_failure",
  CONFIRMED: "confirmed",
  MAIL_SENT: "mail_sent",
  CHANGED: "changed",
  NOTE_CREATED: "note_created",
  NOTE_UPDATED: "note_updated",
  NOTE_DELETED: "note_deleted ",
  CUSTOMER_REMOVED: "customer_removed ",
  CUSTOMER_ADDED: "customer_added",
  FULFILLMENT_ORDER_MOVED: "fulfillment_order_moved",
  FULFILLMENT_SUCCESS: "fulfillment_success",
  FULFILLMENT_CANCEL: "fulfillment_cancelled",
  SALE_SUCCESS: "sale_success",
  REFUND_SUCCESS: "refund_success",
  REFUND_RESTOCK: "refund_restock",
  CLOSED: "closed",
  RE_OPENED: "re_opened",
  CANCELLED: "cancelled",
  AUTHORIZATION_SUCCESS: "authorization_success",
  AUTHORIZATION_FAILURE: "authorization_failure",
  AUTHORIZATION_PENDING: "authorization_pending",
  CAPTURE_SUCCESS: "capture_success",
  CAPTURE_FAILURE: "capture_failure",
  CAPTURE_PENDING: "capture_pending",
  RETURN_CREATED: "return_created",
  RETURN_CANCELED: "return_canceled",
  RETURN_DISPOSED: "return_disposed",
  EDITED: "edited",
};

export const VerbGroupPayment = [
  eventVerb.SALE_SUCCESS,
  eventVerb.SALE_PENDING,
  eventVerb.SALE_FAILURE,
  eventVerb.CAPTURE_SUCCESS,
  eventVerb.CAPTURE_FAILURE,
  eventVerb.CAPTURE_PENDING,
  eventVerb.AUTHORIZATION_SUCCESS,
  eventVerb.AUTHORIZATION_FAILURE,
  eventVerb.AUTHORIZATION_PENDING,
];
export const VerbGroupFulfillment = [eventVerb.FULFILLMENT_SUCCESS, eventVerb.FULFILLMENT_CANCEL];
export const VerbGroupRefund = [eventVerb.REFUND_SUCCESS, eventVerb.REFUND_RESTOCK];
export const VerbGroupReturn = [eventVerb.RETURN_CANCELED, eventVerb.RETURN_CREATED, eventVerb.RETURN_DISPOSED];

export const VerbGroupOthers = [
  eventVerb.PLACED,
  eventVerb.CONFIRMED,
  eventVerb.CLOSED,
  eventVerb.RE_OPENED,
  eventVerb.CANCELLED,
];

export const VerbGroupNote = [eventVerb.NOTE_CREATED, eventVerb.NOTE_UPDATED, eventVerb.NOTE_DELETED];

export type EventResponse = {
  id: number;
  arguments: string[];
  body: string;
  created_on: string;
  description: string;
  path: string;
  message: string;
  subject_id: number;
  subject_type: string;
  author: string;
  authorId: string;
  verb: string;
};

export type EventFilter = {
  query?: string;
  page?: number;
  limit?: number;
  created_on_min?: string;
  created_on_max?: string;
  created_on_predefined?: TextDateTransfer;
  subject_type?: string;
  subject_id?: number;
};
