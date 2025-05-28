package vn.hust.omni.sale.service.store.application.model.location;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LocationsResponse {
    private List<LocationResponse> locations;
    private long count;
}
