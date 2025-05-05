package vn.hust.omni.sale.shared.common_validator.exception;

import java.util.List;

public class ConstraintViolationException extends RuntimeException {
    private final ErrorMessage errorMessage;

    public ConstraintViolationException(ErrorMessage errors) {
        this.errorMessage = errors;
    }

    public ConstraintViolationException(String key, String message) {
        this.errorMessage = ErrorMessage.builder().addError(key, message).build();
    }

    public ConstraintViolationException(UserError userError) {
        this.errorMessage = ErrorMessage.builder().addError(userError).build();
    }

    public ConstraintViolationException(List<UserError> userErrors) {
        var builder = ErrorMessage.builder();
        for (UserError userError : userErrors) {
            builder.addError(userError);
        }
        this.errorMessage = builder.build();
    }

    public ErrorMessage getErrorMessage() {
        return errorMessage;
    }

    @Override
    public String getMessage() {
        return errorMessage.toString();
    }

    @Override
    public String toString() {
        return errorMessage.toString();
    }
}
