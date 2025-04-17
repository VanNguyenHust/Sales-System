package vn.hust.omni.sale.shared.common_validator.exception;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.TypeMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Order(100)
@ControllerAdvice
@ResponseBody
@Slf4j
public final class DefaultExceptionHandlerAdvice {

    @Autowired
    private DefaultExceptionHandlerAdviceConfig defaultExceptionHandlerAdviceConfig;

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorMessage> missingServletRequestParameterHandler(MissingServletRequestParameterException e) {
        return sendError(HttpStatus.BAD_REQUEST, ErrorMessage.builder()
                .addError(UserError.builder()
                        .fields(List.of(e.getParameterName()))
                        .message(String.format("Missing param '%s'", e.getParameterName()))
                        .code("required")
                        .build())
                .build());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorMessage> messageNotReadableException(HttpMessageNotReadableException e) {
        var cause = e.getCause();
        ErrorMessage errorMessage = null;
        if (cause != null) {
            if (cause instanceof JsonParseException) {
                errorMessage = ErrorMessage.builder()
                        .setMessage("Invalid json format")
                        .build();
            } else if (cause instanceof JsonMappingException jsonMappingException) {
                errorMessage = ErrorMessageUtils.toErrorMessage(jsonMappingException);
            } else if (cause instanceof JsonProcessingException) {
                errorMessage = ErrorMessage.builder()
                        .setMessage("Invalid json format")
                        .build();
            }
        }
        if (errorMessage == null) {
            errorMessage = ErrorMessage.builder()
                    .setMessage("Can't read request")
                    .build();
        }
        return sendError(HttpStatus.BAD_REQUEST, errorMessage);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorMessage> methodArgumentTypeMismatchHandler(MethodArgumentTypeMismatchException e) {
        return sendError(HttpStatus.BAD_REQUEST, ErrorMessage.builder()
                .addError(UserError.builder()
                        .code("typeMismatch")
                        .message(ErrorMessageUtils.toMessage(e.getRequiredType(), e.getValue()))
                        .fields(List.of(e.getName()))
                        .build())
                .build());
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorMessage> bindExceptionHandler(BindException e) {
        var builder = ErrorMessage.builder();
        for (var error : e.getBindingResult().getFieldErrors()) {
            try {
                var typeMismatch = error.unwrap(TypeMismatchException.class);
                var field = Optional.ofNullable(typeMismatch.getPropertyName()).orElse(error.getField());
                builder.addError(UserError.builder()
                        .code("typeMismatch")
                        .message(ErrorMessageUtils.toMessage(typeMismatch.getRequiredType(), typeMismatch.getValue()))
                        .fields(List.of(field))
                        .build());
            } catch (IllegalArgumentException ignored) {
                builder.addError(UserError.builder()
                        .code("typeMismatch")
                        .fields(List.of(error.getField()))
                        .build());
            }
        }
        return sendError(HttpStatus.BAD_REQUEST, builder.build());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorMessage> requestMethodNotSupportedHandler(HttpRequestMethodNotSupportedException e) {
        return sendError(HttpStatus.METHOD_NOT_ALLOWED, ErrorMessage.builder()
                .setMessage(String.format("Not supported request method '%s'", e.getMethod()))
                .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorMessage> methodArgumentNotValidHandler(MethodArgumentNotValidException e, HttpServletRequest servletRequest) {
        var builder = ErrorMessage.builder();
        var shouldBadRequest = false;
        var usingOldStyle = defaultExceptionHandlerAdviceConfig.isUseOldUnprocessableEntityMessageStyle(servletRequest);
        var fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .sorted(Comparator.comparing(FieldError::getField))
                .toList();
        for (var fieldError : fieldErrors) {
            try {
                var typeMismatch = fieldError.unwrap(TypeMismatchException.class);
                var field = typeMismatch.getPropertyName();
                if (field != null) {
                    var userError = UserError.builder()
                            .code("typeMismatch")
                            .message(ErrorMessageUtils.toMessage(typeMismatch.getRequiredType(), typeMismatch.getValue()))
                            .fields(List.of(field))
                            .build();
                    if (usingOldStyle) {
                        builder.addError(String.join(".", userError.getFields()), userError.getMessage());
                    } else {
                        builder.addError(userError);
                    }
                    shouldBadRequest = true;
                    continue;
                }
            } catch (IllegalArgumentException ignored) {
                // ignored
            }
            try {
                var violation = fieldError.unwrap(ConstraintViolation.class);
                var userError = ErrorMessageUtils.toUserError(violation);
                if (usingOldStyle) {
                    builder.addError(String.join(".", userError.getFields()), userError.getMessage());
                } else {
                    builder.addError(userError);
                }
                continue;
            } catch (IllegalArgumentException ignored) {
                // ignored
            }
            log.warn("don't known how to resolve error: {}", fieldError.getDefaultMessage());
        }
        var globalErrors = e.getBindingResult().getGlobalErrors();
        for (var error : globalErrors) {
            try {
                var violation = error.unwrap(ConstraintViolation.class);
                // annotation should implement String code()
                String errorCode;
                var codeAttribute = violation.getConstraintDescriptor().getAttributes().get("code");
                if (codeAttribute != null) {
                    errorCode = codeAttribute.toString();
                } else {
                    errorCode = "invalid";
                }
                var userError = UserError.builder()
                        .code(errorCode)
                        .message(violation.getMessage())
                        .build();
                builder.addError(userError);
            } catch (IllegalArgumentException ignored) {
                // ignored
            }
            log.warn("should not reached here. Error msg anyway: {}", error.getDefaultMessage());
        }
        return sendError(shouldBadRequest ? HttpStatus.BAD_REQUEST : HttpStatus.UNPROCESSABLE_ENTITY, builder.build());
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorMessage> handlerMethodValidationHandler(HandlerMethodValidationException e, HttpServletRequest servletRequest) {
        boolean useLegacyErrorFormat = defaultExceptionHandlerAdviceConfig.isUseOldUnprocessableEntityMessageStyle(servletRequest);
        var builder = ErrorMessage.builder();
        for (var validationResult : e.getValueResults()) {
            if (CollectionUtils.isEmpty(validationResult.getResolvableErrors())) {
                continue;
            }
            if (useLegacyErrorFormat) {
                var fieldName = validationResult.getMethodParameter().getParameterName();
                var defaultMsg = validationResult.getResolvableErrors().stream()
                        .map(MessageSourceResolvable::getDefaultMessage)
                        .filter(Objects::nonNull)
                        .findFirst().orElse("is invalid");
                builder.addError(fieldName, defaultMsg);
            } else {
                builder.addError(ErrorMessageUtils.toUserError(validationResult));
            }
        }
        return sendError(HttpStatus.BAD_REQUEST, builder.build());
    }

    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<ErrorMessage> constraintViolationHandler(jakarta.validation.ConstraintViolationException e, HttpServletRequest servletRequest) {
        var useLegacyErrorFormat = defaultExceptionHandlerAdviceConfig.isUseOldUnprocessableEntityMessageStyle(servletRequest);
        var errorMessage = ErrorMessageUtils.toErrorMessage(e.getConstraintViolations(), useLegacyErrorFormat);
        return sendError(HttpStatus.UNPROCESSABLE_ENTITY, errorMessage);
    }

    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<ErrorMessage> constraintViolationHandler(TransactionSystemException e, HttpServletRequest servletRequest) {
        if (e.getRootCause() instanceof jakarta.validation.ConstraintViolationException constraintViolationException) {
            var useLegacyErrorFormat = defaultExceptionHandlerAdviceConfig.isUseOldUnprocessableEntityMessageStyle(servletRequest);
            var errorMsg = ErrorMessageUtils.toErrorMessage(constraintViolationException.getConstraintViolations(), useLegacyErrorFormat);
            return sendError(HttpStatus.UNPROCESSABLE_ENTITY, errorMsg);
        }
        log.error("general transaction error", e);
        return sendError(HttpStatus.INTERNAL_SERVER_ERROR, ErrorMessage.builder()
                .setMessage("Internal server error")
                .build());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorMessage> notFoundExceptionHandler(NotFoundException e) {
        return sendError(HttpStatus.NOT_FOUND, ErrorMessage.builder().setMessage(e.getMessage()).build());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorMessage> constraintViolationExceptionHandler(ConstraintViolationException e) {
        return sendError(HttpStatus.UNPROCESSABLE_ENTITY, e.getErrorMessage());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorMessage> noHandlerFoundExceptionHandler() {
        return sendError(HttpStatus.NOT_FOUND, ErrorMessage.builder()
                .setMessage("Request path is not found")
                .build());
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<ErrorMessage> mediaTypeNotAcceptableHandler() {
        return sendError(HttpStatus.NOT_ACCEPTABLE, ErrorMessage.builder()
                .setMessage("Http media type is not acceptable")
                .build());
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorMessage> mediaTypeNotSupportedHandler() {
        return sendError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ErrorMessage.builder()
                .setMessage("Http media type is not supported")
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> unexpectedException(Exception e) {
        log.error("internal error", e);
        return sendError(HttpStatus.INTERNAL_SERVER_ERROR, ErrorMessage.builder()
                .setMessage("Internal server error")
                .build());
    }

    private ResponseEntity<ErrorMessage> sendError(HttpStatus status, ErrorMessage errorMessage) {
        return ResponseEntity.status(status)
                // Khi accept header không hợp lệ được truyền lên ảnh hưởng tới cách spring xác định http converter cho ErrorMessage
                // vì thế cần set content type cụ thể để cho việc ghi nội dung vẫn như mong đợi
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(errorMessage);
    }
}
