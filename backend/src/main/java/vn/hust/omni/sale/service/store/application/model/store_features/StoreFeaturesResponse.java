package vn.hust.omni.sale.service.store.application.model.store_features;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@JsonRootName("features")
public class StoreFeaturesResponse {
    private Map<String, Boolean> features;
}
