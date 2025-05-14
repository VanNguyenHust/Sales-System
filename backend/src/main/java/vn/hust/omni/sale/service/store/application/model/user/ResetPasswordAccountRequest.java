package vn.hust.omni.sale.service.store.application.model.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResetPasswordAccountRequest {
    private int storeId;
    private String email;
    private String tokenCode;
    private String newPassword;
    private String confirmPassword;
}
