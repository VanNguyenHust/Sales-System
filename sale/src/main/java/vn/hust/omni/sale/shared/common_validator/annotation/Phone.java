package vn.hust.omni.sale.shared.common_validator.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.hust.omni.sale.shared.common_validator.PhoneValidator;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
public @interface Phone {
    String message() default "is invalid phone format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String region() default "ZZ";

    Mode mode() default Mode.LAX;

    enum Mode {
        STRICT, LAX
    }
}
