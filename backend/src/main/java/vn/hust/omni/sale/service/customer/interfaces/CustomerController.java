package vn.hust.omni.sale.service.customer.interfaces;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.hust.omni.sale.service.customer.application.model.CustomerDto;
import vn.hust.omni.sale.service.customer.application.model.CustomerFilter;
import vn.hust.omni.sale.service.customer.application.service.CustomerService;
import vn.hust.omni.sale.shared.common_model.CountResponse;
import vn.hust.omni.sale.shared.security.StoreId;

import java.util.List;

@RestController
@RequestMapping("/admin/customers")
@AllArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

//    @GetMapping
//    public List<CustomerDto> customerList(
//            @StoreId int storeId,
//            CustomerFilter filter
//    ) {
//        return customerService.search(storeId, filter);
//    }
//
//    @GetMapping("/count")
//    public CountResponse customerCount(
//            @StoreId int storeId,
//            CustomerFilter filter) {
//        return new CountResponse(customerService.count(storeId, filter));
//    }
}
