package vn.hust.omni.sale.service.product.application.model;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.util.Optional;

@Data
@Builder
public class ProductImageRequest {
    private Optional<Integer> id;
    private String src;
    private String filename;
    private Optional<@Size(max = 255) String> alt;
}
