package vn.hust.omni.sale.service.product.domain.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import lombok.experimental.Accessors;
import vn.hust.omni.sale.service.product.domain.ddd.ValueObject;
import vn.hust.omni.sale.shared.common_util.NumberUtils;

import java.math.BigDecimal;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Embeddable
@EqualsAndHashCode
@Accessors(chain = true)
@AllArgsConstructor
@Getter
@Builder
public class ProductPricingInfo implements ValueObject<ProductPricingInfo> {
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal priceMax = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal priceMin = BigDecimal.ZERO;
    @Builder.Default
    private boolean priceVaries = false;

    @DecimalMin(value = "0")
    @DecimalMax(value = "100000000000000")
    private BigDecimal compareAtPrice;
    @Builder.Default
    private BigDecimal compareAtPriceMax = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal compareAtPriceMin = BigDecimal.ZERO;
    @Builder.Default
    private boolean compareAtPriceVaries = false;

    private BigDecimal costPrice;

    @Override
    public boolean sameAs(ProductPricingInfo other) {
        return NumberUtils.equals(priceMax, other.priceMax)
               && NumberUtils.equals(priceMin, other.priceMin)
               && priceVaries == other.priceVaries
               && NumberUtils.equals(compareAtPriceMax, other.compareAtPriceMax)
               && NumberUtils.equals(compareAtPriceMin, other.compareAtPriceMin)
               && compareAtPriceVaries == other.compareAtPriceVaries;
    }
}
