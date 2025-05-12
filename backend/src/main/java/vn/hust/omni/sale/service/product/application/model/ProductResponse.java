package vn.hust.omni.sale.service.product.application.model;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
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
    private Instant publishedOn;

    private Instant createdOn;
    private Instant modifiedOn;

    private Set<ProductTagResponse> tags;
    private List<ProductImageResponse> images;
}
