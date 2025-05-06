package vn.hust.omni.sale.service.store.application.model.store.administrator;

import lombok.Builder;
import lombok.Getter;
import vn.hust.omni.sale.shared.common_model.PagingFilterRequest;

@Getter
@Builder
public class FilterStoresRequest extends PagingFilterRequest {
    private String query;
    private String province;
    private Integer status;
}
