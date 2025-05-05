export interface Ticket {
  topic: string;
  title: string;
  description: string;
  tags?: string[];
  attachments?: Attachment[];
  sender?: Sender;
}

export interface TicketRequest {
  ticket: Ticket;
}

interface Attachment {
  base64: string;
  filename: string;
}

interface Sender {
  email?: string;
  phone?: string;
  name: string;
}

export interface TicketResponse {
  ticket: {
    id: number;
  };
}

export type ShipmentsPrintResponse = {
  contents: string[];
  subject: string;
};
