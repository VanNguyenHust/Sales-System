package vn.hust.omni.sale.service.store.application.model.location;

import lombok.Builder;
import lombok.Getter;
import vn.hust.omni.sale.shared.common_model.PagingFilterRequest;

@Getter
@Builder
public class FilterLocationsRequest extends PagingFilterRequest {
    private String query;
}
