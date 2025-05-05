package vn.hust.omni.sale.service.store.application.model.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateUserAccountRequest {
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private boolean accountOwner;
    private long storeRoleId;
    private String permissions;
}
