package vn.hust.omni.sale.shared.common_validator;

import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ValidatorUtils {

    public static <T> void validateAndThrow(Validator validator, T object) {
        var violations = validator.validate(object);
        if (violations.isEmpty()) {
            return;
        }
        throw new ConstraintViolationException(violations);
    }

    public static ValidatorHelperContext withContext(ConstraintValidatorContext context) {
        return new ValidatorHelperContext(context);
    }

    public static class ValidatorHelperContext {
        private final ConstraintValidatorContext context;
        private boolean rs;

        private ValidatorHelperContext(ConstraintValidatorContext context) {
            this.context = context;
            this.rs = true;
        }

        /**
         * Convenient method to construct FieldError, for use with class level validate annotation.
         *
         * @param field   field name
         * @param message error message if test condition resolved to true
         * @param test    violation condition
         */
        public void assertFalse(String field, String message, boolean test) {
            if (!test) {
                return;
            }
            fail(field, message);
        }

        public void fail(String field, String message) {
            if (rs) {
                context.disableDefaultConstraintViolation();
                rs = false;
            }
            context.buildConstraintViolationWithTemplate(message)
                    .addPropertyNode(field)
                    .addConstraintViolation();
        }

        public boolean getResult() {
            return rs;
        }

    }
}
