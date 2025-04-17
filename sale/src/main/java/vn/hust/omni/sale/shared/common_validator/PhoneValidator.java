package vn.hust.omni.sale.shared.common_validator;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import vn.hust.omni.sale.shared.common_validator.annotation.Phone;

import static com.google.i18n.phonenumbers.PhoneNumberUtil.PhoneNumberFormat.E164;
import static com.google.i18n.phonenumbers.PhoneNumberUtil.PhoneNumberType.FIXED_LINE_OR_MOBILE;

@NoArgsConstructor
@AllArgsConstructor
public class PhoneValidator implements ConstraintValidator<Phone, String> {

    Phone.Mode validationMode;
    String defaultRegion;

    @Override
    public void initialize(Phone constraintAnnotation) {
        validationMode = constraintAnnotation.mode();
        defaultRegion = constraintAnnotation.region();
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null) {
            return true;
        }
        if (phoneNumber.startsWith("+")) {
            return tryParseToE164(phoneNumber, this.defaultRegion) != null;
        }
        if (validationMode == Phone.Mode.STRICT) {
            return false;
        }
        if (StringUtils.isNumeric(phoneNumber)) {
            var len = phoneNumber.length();
            return 7 <= len && len <= 15;
        }
        return false;
    }

    public static String tryParseToE164(String number, String region) {
        var util = PhoneNumberUtil.getInstance();
        try {
            var phoneNumber = util.parse(number, region != null ? region : "ZZ");
            if (isValidPhoneNumber(phoneNumber)) {
                return util.format(phoneNumber, E164);
            }
        } catch (NumberParseException ignore) {
        }
        return null;
    }

    public static boolean isValidPhoneNumber(Phonenumber.PhoneNumber phoneNumber) {
        var util = PhoneNumberUtil.getInstance();
        if ("VN".equals(util.getRegionCodeForNumber(phoneNumber))) {
            var nationalNumber = String.valueOf(phoneNumber.getNationalNumber());
            // fixed-line
            if (nationalNumber.startsWith("2")) {
                return nationalNumber.length() == 10;
            }
        }
        //@formatter:off
        return util.isValidNumber(phoneNumber)
            && util.isPossibleNumberForType(phoneNumber, FIXED_LINE_OR_MOBILE);
        //@formatter:on
    }
}
