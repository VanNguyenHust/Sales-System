package vn.hust.omni.sale.shared.common_validator.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.hust.omni.sale.shared.common_validator.StringInListValidator;

import java.lang.annotation.*;

/**
 * should use enum when possible
 */
@Documented
@Constraint(validatedBy = StringInListValidator.class)
@Target({ElementType.FIELD, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface StringInList {
    String[] array() default {};

    boolean allowBlank() default false;

    String message() default "invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
