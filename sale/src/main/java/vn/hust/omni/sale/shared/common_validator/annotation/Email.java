package vn.hust.omni.sale.shared.common_validator.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.hust.omni.sale.shared.common_validator.EmailValidator;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = EmailValidator.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
public @interface Email {
    String message() default "is invalid email format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
