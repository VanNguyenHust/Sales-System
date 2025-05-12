package vn.hust.omni.sale.service.product.application.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductTagResponse {
    @JsonValue
    private String name;

    @JsonCreator
    public ProductTagResponse(String name) {
        this.name = name;
    }
}
