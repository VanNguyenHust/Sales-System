package vn.hust.omni.sale.service.store.application.model.store;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateStoreRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private String countryCode;
    private String provinceCode;
    private String address;
}
