package vn.hust.omni.sale.shared.common_validator.exception;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

@Getter
@Builder
@EqualsAndHashCode
public class UserError {
    private String code;
    private String message;
    @Builder.Default
    private List<String> fields = Collections.emptyList();

    @Override
    public String toString() {
        return "UserError{" +
                "code='" + code + '\'' +
                ", message='" + message + '\'' +
                ", fields=" + fields +
                '}';
    }
}
