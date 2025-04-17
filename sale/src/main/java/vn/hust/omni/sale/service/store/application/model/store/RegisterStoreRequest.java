package vn.hust.omni.sale.service.store.application.model.store;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonRootName("store")
public class RegisterStoreRequest {
    private String fullName;
    private String name;
    private String phone;
    private String province;
}
