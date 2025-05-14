package vn.hust.omni.sale.shared.mail.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendInvitedManageStore {
    private String email;
    private String fullName;
    private String confirmCode;
}
