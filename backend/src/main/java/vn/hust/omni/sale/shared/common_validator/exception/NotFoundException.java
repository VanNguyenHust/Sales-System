package vn.hust.omni.sale.shared.common_validator.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException() {
        super("Not Found");
    }
}
