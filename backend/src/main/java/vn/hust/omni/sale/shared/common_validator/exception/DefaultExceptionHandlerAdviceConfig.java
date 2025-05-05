package vn.hust.omni.sale.shared.common_validator.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;

import java.util.function.Function;

@Builder
public class DefaultExceptionHandlerAdviceConfig {

    private Function<HttpServletRequest, Boolean> isUseOldUnprocessableEntityMessageStyleSupplier;

    public boolean isUseOldUnprocessableEntityMessageStyle(HttpServletRequest servletRequest) {
        if (isUseOldUnprocessableEntityMessageStyleSupplier == null)
            return false;

        var result = isUseOldUnprocessableEntityMessageStyleSupplier.apply(servletRequest);
        return result != null && result;
    }

}
