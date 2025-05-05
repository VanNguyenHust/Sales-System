package vn.hust.omni.sale.shared.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Objects;

@Component
public class StoreIdArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(StoreId.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {

        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        Object storeIdAttr = Objects.requireNonNull(request).getAttribute("STORE_ID");

        if (storeIdAttr == null) {
            throw new IllegalStateException("Missing STORE_ID attribute in request.");
        }

        // Nếu kiểu tham số là int
        if (parameter.getParameterType().equals(int.class)) {
            return Integer.parseInt(storeIdAttr.toString());
        }

        // Nếu bạn muốn hỗ trợ cả kiểu Integer (wrapper)
        if (parameter.getParameterType().equals(Integer.class)) {
            return Integer.valueOf(storeIdAttr.toString());
        }

        throw new IllegalArgumentException("Unsupported parameter type for @StoreId");
    }
}
