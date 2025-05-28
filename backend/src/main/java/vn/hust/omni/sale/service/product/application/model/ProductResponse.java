package vn.hust.omni.sale.service.product.application.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;
import vn.hust.omni.sale.shared.autoconfigure.ObjectMapperConfig;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Data
@Builder
public class ProductResponse {
    private int id;
    private int storeId;
    private String name;
    private String alias;
    private String content;
    private String summary;
    private String unit;
    private Boolean isPublished;
    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant publishedOn;

    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant createdOn;
    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant modifiedOn;

    private List<InventoryResponse> inventories;
    private PricingInfoResponse pricingInfo;
    private Set<ProductTagResponse> tags;
    private List<ProductImageResponse> images;
}
