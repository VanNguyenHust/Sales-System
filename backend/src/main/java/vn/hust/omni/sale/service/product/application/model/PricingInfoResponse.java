package vn.hust.omni.sale.service.product.application.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PricingInfoResponse {
    private String price;
    private String compareAtPrice;
    private String costPrice;
}
