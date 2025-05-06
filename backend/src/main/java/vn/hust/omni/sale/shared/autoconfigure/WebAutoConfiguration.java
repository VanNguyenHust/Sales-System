package vn.hust.omni.sale.shared.autoconfigure;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.ConverterFactory;
import org.springframework.format.FormatterRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import vn.hust.omni.sale.shared.bind.ParamNameServletModelAttributeResolver;
import vn.hust.omni.sale.shared.common_util.DateUtils;
import vn.hust.omni.sale.shared.common_util.EnumUtils;
import vn.hust.omni.sale.shared.common_validator.exception.DefaultExceptionHandlerAdvice;
import vn.hust.omni.sale.shared.common_validator.exception.DefaultExceptionHandlerAdviceConfig;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@AutoConfigureBefore(HttpMessageConvertersAutoConfiguration.class)
public class WebAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(annotation = ControllerAdvice.class)
    public DefaultExceptionHandlerAdvice defaultExceptionHandlerAdvice() {
        return new DefaultExceptionHandlerAdvice();
    }

    @Bean
    @ConditionalOnMissingBean
    public DefaultExceptionHandlerAdviceConfig defaultExceptionHandlerAdviceConfig() {
        return DefaultExceptionHandlerAdviceConfig.builder().build();
    }

    @Component
    public static class ParamNameHandlerMappingPostProcessor implements BeanPostProcessor {
        @Override
        public Object postProcessAfterInitialization(Object bean, String arg1)
                throws BeansException {
            return bean;
        }

        @Override
        public Object postProcessBeforeInitialization(Object bean, String arg1)
                throws BeansException {
            if (bean instanceof RequestMappingHandlerAdapter adapter) {
                List<HandlerMethodArgumentResolver> resolvers = adapter.getCustomArgumentResolvers();
                if (resolvers == null) {
                    resolvers = new ArrayList<>();
                }
                resolvers.add(new ParamNameServletModelAttributeResolver(false));
                adapter.setCustomArgumentResolvers(resolvers);
            }

            return bean;
        }
    }

    @Configuration
    static class SapoWebMvcConfiguration implements WebMvcConfigurer {
        @Override
        public void addFormatters(FormatterRegistry registry) {
            registry.addConverter(new DateStringConverter());
            registry.addConverter(new StringToInstantConverter());
            registry.addConverterFactory(new StringToEnumConverterFactory());
        }

        /**
         * Backward compatible
         * TODO: Should remove this config as soon as posible
         * https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#web-application-changes
         *
         * @param configurer
         */
        @Override
        @SuppressWarnings("deprecation")
        public void configurePathMatch(PathMatchConfigurer configurer) {
            configurer.setUseRegisteredSuffixPatternMatch(true);
            configurer.setUseTrailingSlashMatch(true);
        }
    }

    private static class DateStringConverter implements Converter<String, Date> {
        @Override
        public Date convert(String source) {
            return DateUtils.parse(source);
        }
    }

    private static class StringToInstantConverter implements Converter<String, Instant> {

        @Override
        public Instant convert(String source) {
            return DateUtils.tryParseInstant(source);
        }

    }

    @SuppressWarnings("unchecked")
    private static class StringToEnumConverterFactory implements ConverterFactory<String, Enum> {
        private static class StringToEnumConverter<T extends Enum<T>> implements Converter<String, T> {
            private final Class<T> clazz;

            public StringToEnumConverter(Class<T> clazz) {
                this.clazz = clazz;
            }

            public T convert(String s) {
                var rs = EnumUtils.parse(s, clazz);
                if (rs == null) {
                    throw new IllegalArgumentException();
                }
                return rs;
            }
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T extends Enum> Converter<String, T> getConverter(Class<T> targetType) {
            return new StringToEnumConverter(targetType);
        }
    }

}
