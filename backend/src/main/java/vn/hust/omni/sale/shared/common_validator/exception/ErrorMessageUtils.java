package vn.hust.omni.sale.shared.common_validator.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.validation.method.ParameterValidationResult;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ErrorMessageUtils {
    private static final Map<Class<?>, String> annotationErrorCodeMap = Map.of(
            NotNull.class, "required",
            NotBlank.class, "blank",
            NotEmpty.class, "empty",
            Min.class, "greater_than_or_equal",
            Max.class, "less_than_or_equal"
    );

    static final String DEFAULT_VALIDATION_ERROR_CODE = "invalid";
    static final String DEFAULT_MISTYPE_ERROR_CODE = "typeMismatch";

    private static final Map<Class<?>, String> safeClassMap;
    private static final Validator validator;

    static {
        safeClassMap = new HashMap<>();
        Stream.of(
                int.class,
                Integer.class,
                long.class,
                Long.class,
                short.class,
                Short.class,
                BigInteger.class
        ).forEach(integerClass -> {
            safeClassMap.put(integerClass, "Integer");
        });
        Stream.of(
                float.class,
                Float.class,
                double.class,
                Double.class,
                BigDecimal.class
        ).forEach(decimalClass -> {
            safeClassMap.put(decimalClass, "Decimal");
        });
        safeClassMap.put(boolean.class, "Boolean");
        safeClassMap.put(Boolean.class, "Boolean");
        safeClassMap.put(String.class, "String");
        try (var validatorFactory = Validation.buildDefaultValidatorFactory()) {
            validator = validatorFactory.getValidator();
        }
    }

    private record CodeAndMsg<A, B>(A code, B message) {
    }

    public static <C extends ConstraintViolation<?>> ErrorMessage toErrorMessage(Set<C> errors, boolean useOldStyle) {
        var builder = ErrorMessage.builder();
        for (var error : errors) {
            if (useOldStyle) {
                builder.addError(String.join(".", extractErrorFields(error.getPropertyPath())), error.getMessage());
            } else {
                builder.addError(toUserError(error));
            }
        }
        return builder.build();
    }

    static <C extends ConstraintViolation<?>> UserError toUserError(C error) {
        var constraintAnnotation = error.getConstraintDescriptor().getAnnotation();
        var invalidFields = extractErrorFields(error.getPropertyPath());
        if (constraintAnnotation instanceof Length annotation) {
            var invalidValue = error.getInvalidValue().toString();
            return errorForRangeConstraint(
                    invalidValue.length(), annotation.min(), annotation.max(), invalidFields, true);
        }
        if (constraintAnnotation instanceof Size annotation) {
            var invalidValue = error.getInvalidValue();
            boolean isString = false;
            int size;
            if (invalidValue instanceof Collection<?> collection) {
                size = collection.size();
            } else if (invalidValue instanceof Map<?, ?> map) {
                size = map.size();
            } else if (invalidValue.getClass().isArray()) {
                size = Array.getLength(invalidValue);
            } else {
                // NOTE: for now, always fallback to String
                size = invalidValue.toString().length();
                isString = true;
            }
            return errorForRangeConstraint(
                    size, annotation.min(), annotation.max(), invalidFields, isString);
        }
        return UserError.builder()
                .message(error.getMessage())
                .fields(invalidFields)
                .code(annotationErrorCodeMap.getOrDefault(
                        error.getConstraintDescriptor().getAnnotation().annotationType(),
                        DEFAULT_VALIDATION_ERROR_CODE))
                .build();
    }

    private static UserError errorForRangeConstraint(int size, int min, int max, List<String> fields, boolean isString) {
        String code, message;
        if (isString) {
            if (size > max) {
                code = "too_long";
                message = String.format("is too long (maximum is %d characters)", max);
            } else {
                code = "too_short";
                message = String.format("is too short (minimum is %d characters)", min);
            }
        } else {
            if (size > max) {
                code = "too_big";
                message = String.format("is too big (maximum is %d items)", max);
            } else {
                code = "too_small";
                message = String.format("is too small (minimum is %d items)", min);
            }
        }
        return UserError.builder().fields(fields).code(code).message(message).build();
    }

    static <C extends ParameterValidationResult> UserError toUserError(C validationResult) {
        var fieldName = validationResult.getMethodParameter().getParameterName();
        if (fieldName == null) fieldName = "request"; // here to disable warning, should never happen!
        var defaultMsgAndCode = validationResult.getResolvableErrors().stream()
                .map(re -> {
                    if (re.getDefaultMessage() == null || re.getCodes() == null || re.getCodes().length == 0) {
                        return null;
                    }
                    var code = switch (re.getCodes()[re.getCodes().length - 1]) {
                        case "NotEmpty" -> "empty";
                        case "NotNull" -> "required";
                        case "NotBlank" -> "blank";
                        case "Min" -> "greater_than_or_equal";
                        case "Max" -> "less_than_or_equal";
                        default -> "invalid";
                    };
                    return new CodeAndMsg<>(code, re.getDefaultMessage());
                })
                .filter(Objects::nonNull)
                .findFirst().orElse(new CodeAndMsg<>("invalid", "is invalid"));
        return UserError.builder()
                .fields(List.of(fieldName))
                .code(defaultMsgAndCode.code())
                .message(defaultMsgAndCode.message())
                .build();
    }

    private static final Pattern ROOT_NAME_EX_MSG_PT = Pattern.compile(
            "Root name \\('[^']+'\\) does not match expected \\('[^']+'\\)");

    public static ErrorMessage toErrorMessage(JsonMappingException e) {
        var builder = ErrorMessage.builder();
        String message;
        if (e instanceof InvalidFormatException invalidFormatException) {
            message = toMessage(invalidFormatException.getTargetType(), invalidFormatException.getValue());
        } else if (e instanceof MismatchedInputException mismatchedInputException) {
            message = null;
            if (mismatchedInputException.getMessage().startsWith("Root name")) {
                var matcher = ROOT_NAME_EX_MSG_PT.matcher(mismatchedInputException.getMessage());
                if (matcher.find()) {
                    message = matcher.group();
                }
            }
            if (message == null) {
                message = toMessage(mismatchedInputException.getTargetType(), null);
            }
        } else {
            message = "Can't convert value";
        }
        builder.addError(UserError.builder()
                .code(DEFAULT_MISTYPE_ERROR_CODE)
                .message(message)
                .fields(e.getPath().stream()
                        .map(ref -> {
                            if (ref.getFieldName() != null) {
                                return ref.getFieldName();
                            }
                            return String.valueOf(ref.getIndex());
                        })
                        .collect(Collectors.toList()))
                .build());
        return builder.build();
    }

    public static String toMessage(Class<?> targetClass, Object inputValue) {
        var targetType = safeClassMap.get(targetClass);
        if (targetType != null) {
            if (inputValue != null) {
                var inputType = safeClassMap.get(inputValue.getClass());
                if (inputType != null) {
                    return String.format("Can't convert %s value to %s", inputType, targetType);
                }
            }
            return String.format("Can't convert value to %s", targetType);
        }
        if (targetClass.isArray() || Collection.class.isAssignableFrom(targetClass)) {
            return "Can't convert value to List";
        }
        if (targetClass.isEnum()) {
            var validValues = Arrays.stream(targetClass.getEnumConstants())
                    .map(Object::toString)
                    .collect(Collectors.joining(", "));
            return String.format("must be in valid values [%s]", validValues);
        }
        return "Can't convert value to Hash";
    }

    public static List<UserError> validate(Object object) {
        var errors = validator.validate(object);
        return errors.stream()
                .map(ErrorMessageUtils::toUserError)
                .collect(Collectors.toList());
    }

    private static List<String> extractErrorFields(Path path) {
        var fields = new ArrayList<String>();
        path.forEach(node -> {
            if (node.getKind() == ElementKind.PROPERTY) {
                if (node.getIndex() != null) {
                    fields.add(String.valueOf(node.getIndex()));
                }
                fields.add(node.getName());
            } else if (node.getKind() == ElementKind.CONTAINER_ELEMENT) {
                fields.add(String.valueOf(node.getIndex()));
            }
        });
        return fields;
    }

    private static String toMessage(MismatchedInputException e) {
        Object inputValue = null;
        if (e instanceof InvalidFormatException invalidFormatException) {
            inputValue = invalidFormatException.getValue();
        }
        return toMessage(e.getTargetType(), inputValue);
    }
}
