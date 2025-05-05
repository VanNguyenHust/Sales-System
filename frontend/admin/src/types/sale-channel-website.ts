export type StoreSaleChannel = {
  id: number;
  sale_channel: string;
  store_package_id?: number;
  plan_name?: string;
  plan_display_name?: string;
  start_date: string;
  end_date?: string;
  max_volumn?: number;
  max_products?: number;
  installed: boolean;
};

export type StoreSaleChannelsResponse = {
  channels: StoreSaleChannel[];
};
