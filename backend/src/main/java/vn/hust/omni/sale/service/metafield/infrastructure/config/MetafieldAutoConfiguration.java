package vn.hust.omni.sale.service.metafield.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.hust.omni.sale.service.customer.application.service.CustomerService;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.metafield.application.service.metafield.validator.MetafieldValidatorProvider;
import vn.hust.omni.sale.service.product.application.service.ProductReadService;

@ConditionalOnClass(MetafieldService.class)
@Configuration
@AutoConfigureBefore(DataSourceAutoConfiguration.class)
public class MetafieldAutoConfiguration {

    @Bean
    MetafieldValidatorProvider metafieldValidatorProvider(ObjectMapper json, CustomerService customerService, ProductReadService productService) {
        return new MetafieldValidatorProvider(json, customerService, productService);
    }
}
