package vn.hust.omni.sale.service.store.application.model.store;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonRootName("enable")
public class EnableStoreRequest {
    private String confirmCode;
    private String name;
    private String password;
    private String confirmPassword;
}
