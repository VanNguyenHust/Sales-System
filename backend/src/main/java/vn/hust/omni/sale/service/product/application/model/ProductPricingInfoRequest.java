package vn.hust.omni.sale.service.product.application.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductPricingInfoRequest {
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
}
