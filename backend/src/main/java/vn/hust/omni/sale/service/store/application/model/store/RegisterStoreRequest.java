package vn.hust.omni.sale.service.store.application.model.store;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterStoreRequest {
    private String firstName;
    private String lastName;
    private String name;
    private String email;
    private String phone;
    private String province;
}
