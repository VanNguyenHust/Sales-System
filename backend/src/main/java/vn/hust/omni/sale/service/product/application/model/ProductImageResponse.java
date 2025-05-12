package vn.hust.omni.sale.service.product.application.model;

import lombok.Data;

import java.time.Instant;

@Data
public class ProductImageResponse {
    private int id;
    private int productId;
    private String src;
    private String alt;
    private String filename;

    private Instant createdOn;
    private Instant modifiedOn;
}
