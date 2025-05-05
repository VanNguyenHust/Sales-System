package vn.hust.omni.sale.shared.common_validator.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.hust.omni.sale.shared.common_validator.DigitsDecimalValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE_USE, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DigitsDecimalValidator.class)
public @interface DigitsDecimal {
    String message() default "Invalid decimal number";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int integer();

    int fraction();

    boolean allowTrailingZero() default false;
}