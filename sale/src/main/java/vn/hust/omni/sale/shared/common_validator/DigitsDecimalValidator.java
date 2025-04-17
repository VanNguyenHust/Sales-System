package vn.hust.omni.sale.shared.common_validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.hust.omni.sale.shared.common_validator.annotation.DigitsDecimal;

import java.math.BigDecimal;

public class DigitsDecimalValidator implements ConstraintValidator<DigitsDecimal, BigDecimal> {
    private int integer;
    private int fraction;
    private boolean allowTrailingZero;

    @Override
    public void initialize(DigitsDecimal annotation) {
        integer = annotation.integer();
        fraction = annotation.fraction();
        allowTrailingZero = annotation.allowTrailingZero();
    }

    @Override
    public boolean isValid(BigDecimal value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        var scale = value.scale();
        if (allowTrailingZero) {
            scale = value.stripTrailingZeros().scale();
        }

        return value.precision() <= integer && scale <= fraction;
    }
}