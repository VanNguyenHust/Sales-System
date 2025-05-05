export enum TourguideHandle {
  TOUR_GUIDE_ORDER = "tour_guide_order",
  HOTSPOT_ORDER = "hotspot_order",
  TOUR_GUIDE_PRODUCT = "tour_guide_product",
  HOTSPOT_PRODUCT = "hotspot_product",
}

export type Tourguide = {
  handle: TourguideHandle;
  type: "tour_guide";
  complete: boolean;
  status?: boolean;
};
