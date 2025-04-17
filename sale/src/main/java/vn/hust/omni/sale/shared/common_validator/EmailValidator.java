package vn.hust.omni.sale.shared.common_validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.hust.omni.sale.shared.common_validator.annotation.Email;

public class EmailValidator implements ConstraintValidator<Email, String> {

    @Deprecated
    public static boolean isValid(String email) {
        return org.apache.commons.validator.routines.EmailValidator.getInstance().isValid(email);
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email != null) {
            return org.apache.commons.validator.routines.EmailValidator.getInstance().isValid(email);
        }
        return true;
    }
}
