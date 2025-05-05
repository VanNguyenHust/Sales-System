package vn.hust.omni.sale.shared.bind;

import jakarta.servlet.ServletRequest;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.core.MethodParameter;
import org.springframework.util.Assert;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.ServletModelAttributeMethodProcessor;
import org.springframework.web.util.WebUtils;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class ParamNameServletModelAttributeResolver extends ServletModelAttributeMethodProcessor {

    /**
     * A map caching annotation definitions of command objects (@CommandParameter-to-fieldname mappings)
     */
    private ConcurrentMap<Class<?>, Map<String, String>> definitionsCache = new ConcurrentHashMap<>();

    public ParamNameServletModelAttributeResolver(boolean annotationNotRequired) {
        super(annotationNotRequired);
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        if (parameter.getParameterType().isAnnotationPresent(SupportParamName.class)) {
            return true;
        }
        return false;
    }

    @Override
    protected void bindRequestParameters(WebDataBinder binder, NativeWebRequest request) {
        ServletRequest servletRequest = request.getNativeRequest(ServletRequest.class);
        ServletRequestDataBinder servletBinder = (ServletRequestDataBinder) binder;
        bind(servletRequest, servletBinder);
    }

    @SuppressWarnings("unchecked")
    public void bind(ServletRequest request, ServletRequestDataBinder binder) {
        Map<String, ?> propertyValues = parsePropertyValues(request, binder);
        MutablePropertyValues mpvs = new MutablePropertyValues(propertyValues);
        MultipartRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartRequest.class);
        if (multipartRequest != null) {
            bindMultipart(multipartRequest.getMultiFileMap(), mpvs);
        }

        // two lines copied from ExtendedServletRequestDataBinder
        String attr = HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE;
        mpvs.addPropertyValues((Map<String, String>) request.getAttribute(attr));
        binder.bind(mpvs);
    }

    private Map<String, ?> parsePropertyValues(ServletRequest request, ServletRequestDataBinder binder) {

        // similar to WebUtils.getParametersStartingWith(..) (prefixes not supported)
        Map<String, Object> params = new TreeMap<>();
        Assert.notNull(request, "Request must not be null");
        Enumeration<?> paramNames = request.getParameterNames();
        Map<String, String> parameterMappings = getParameterMappings(binder);
        while (paramNames != null && paramNames.hasMoreElements()) {
            String paramName = (String) paramNames.nextElement();
            String[] values = request.getParameterValues(paramName);

            String fieldName = parameterMappings.get(paramName);
            // no annotation exists, use the default - the param name=field name
            if (fieldName == null) {
                fieldName = paramName;
            }

            if (values == null || values.length == 0) {
                // Do nothing, no values found at all.
            } else if (values.length > 1) {
                params.put(fieldName, values);
            } else {
                params.put(fieldName, values[0]);
            }
        }

        return params;
    }

    /**
     * Gets a mapping between request parameter names and field names.
     * If no annotation is specified, no entry is added
     *
     * @return
     */
    private Map<String, String> getParameterMappings(ServletRequestDataBinder binder) {
        Class<?> targetClass = binder.getTarget().getClass();
        var cached = definitionsCache.get(targetClass);
        if (cached == null) {
            var result = new HashMap<String, String>();
            ReflectionUtils.doWithFields(targetClass, field -> {
                var annotation = field.getAnnotation(ParamName.class);
                if (annotation != null && !annotation.value().isEmpty()) {
                    result.put(annotation.value(), field.getName());
                }
            });
            definitionsCache.putIfAbsent(targetClass, result);
            return result;
        } else {
            return cached;
        }
    }

    /**
     * Copied from WebDataBinder.
     *
     * @param multipartFiles
     * @param mpvs
     */
    protected void bindMultipart(Map<String, List<MultipartFile>> multipartFiles, MutablePropertyValues mpvs) {
        for (Map.Entry<String, List<MultipartFile>> entry : multipartFiles.entrySet()) {
            String key = entry.getKey();
            List<MultipartFile> values = entry.getValue();
            if (values.size() == 1) {
                MultipartFile value = values.get(0);
                if (!value.isEmpty()) {
                    mpvs.add(key, value);
                }
            } else {
                mpvs.add(key, values);
            }
        }
    }
}