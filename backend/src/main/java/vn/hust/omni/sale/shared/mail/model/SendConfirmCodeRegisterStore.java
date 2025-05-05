package vn.hust.omni.sale.shared.mail.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendConfirmCodeRegisterStore {
    private String email;
    private String fullName;
    private String confirmCode;
}
