package vn.hust.omni.sale.service.store.application.model.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String refreshToken;
    private int storeId;
    private String storeAlias;
    private long resourceId;
    private String resourceType;
}
