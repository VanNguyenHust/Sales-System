package vn.hust.omni.sale.shared.common_validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import vn.hust.omni.sale.shared.common_validator.annotation.StringInList;

public class StringInListValidator implements
        ConstraintValidator<StringInList, String> {
    private StringInList annotation;

    @Override
    public void initialize(StringInList stringInList) {
        this.annotation = stringInList;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (annotation.allowBlank() && StringUtils.isEmpty(value))
            return true;
        else if (ArrayUtils.contains(annotation.array(), value))
            return true;

        context.disableDefaultConstraintViolation();

        var message = String.format("is not in [%s]",
                StringUtils.join(annotation.array(), ","));

        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();

        return false;
    }

}
