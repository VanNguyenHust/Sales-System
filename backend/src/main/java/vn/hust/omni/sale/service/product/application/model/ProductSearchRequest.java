package vn.hust.omni.sale.service.product.application.model;

import lombok.Getter;
import lombok.Setter;
import vn.hust.omni.sale.shared.bind.SupportParamName;
import vn.hust.omni.sale.shared.common_model.PagingFilterRequest;

@SupportParamName
@Getter
@Setter
public class ProductSearchRequest extends PagingFilterRequest {
    private String query;
    private String sort;
}
