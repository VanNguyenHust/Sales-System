package vn.hust.omni.sale.shared.common_validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;
import vn.hust.omni.sale.shared.common_validator.annotation.MaxSize;

public class MaxSizeValidator implements ConstraintValidator<MaxSize, String> {
    private int maxByte = 0;

    @Override
    public void initialize(MaxSize maxSize) {
        this.maxByte = maxSize.bytes();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (this.maxByte > 0 && StringUtils.isNotEmpty(value) && value.getBytes().length > this.maxByte) {
            context.disableDefaultConstraintViolation();

            String message = String.format("is too big: %.1f KB (maximum is %d KB)",
                    (float) value.getBytes().length / 1024, this.maxByte / 1024);

            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }
        return true;
    }

}