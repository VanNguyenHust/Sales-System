package vn.hust.omni.sale.service.customer.application.model;

import lombok.Getter;
import lombok.Setter;
import vn.hust.omni.sale.shared.bind.SupportParamName;
import vn.hust.omni.sale.shared.common_model.PagingFilterRequest;

import java.util.Set;

@Getter
@Setter
@SupportParamName
public class CustomerFilter extends PagingFilterRequest {
    private String query;
    private Set<Integer> ids;
    private Boolean reverse;
}
