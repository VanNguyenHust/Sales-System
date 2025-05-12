package vn.hust.omni.sale.service.product.application.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldRequest;
import vn.hust.omni.sale.shared.common_validator.annotation.MaxSize;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


@Jacksonized
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductRequest {
    private Optional<@NotBlank @Size(max = 320) String> name;
    private Optional<@MaxSize String> content;
    private Optional<@Size(max = 1000) String> summary;
    private Optional<@Size(max = 255) String> unit;
    private Optional<Boolean> isPublished;
    private Optional<Instant> publishedOn;
    private List<String> tags;
    private @Valid ProductPricingInfoRequest pricingInfo;
    private @Valid List<InventoryRequest> inventories;
    private @Valid @Size(max = 250) List<ProductImageRequest> images;
    private @Valid List<MetafieldRequest> metafields;
}
