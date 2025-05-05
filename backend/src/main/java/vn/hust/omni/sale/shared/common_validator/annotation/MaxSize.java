package vn.hust.omni.sale.shared.common_validator.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.hust.omni.sale.shared.common_validator.MaxSizeValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = MaxSizeValidator.class)
@Target({ElementType.FIELD, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MaxSize {
    int bytes() default 65536;

    String message() default "invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
