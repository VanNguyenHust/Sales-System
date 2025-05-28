package vn.hust.omni.sale.service.product.application.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import vn.hust.omni.sale.shared.autoconfigure.ObjectMapperConfig;

import java.time.Instant;

@Data
public class ProductImageResponse {
    private int id;
    private int productId;
    private String src;
    private String alt;
    private String filename;

    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant createdOn;
    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant modifiedOn;
}
