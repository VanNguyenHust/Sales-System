package vn.hust.omni.sale.service.metafield.application.service.definition;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.Assert;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionCreateRequest;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionResponse;
import vn.hust.omni.sale.service.metafield.application.service.mapper.MetafieldDefinitionMapper;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldUtils;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldDefinitionRepository;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetafieldDefinitionService {
    private final JpaMetafieldDefinitionRepository metafieldDefinitionRepository;
    private final MetafieldUtils metafieldUtils;
    private final TransactionTemplate transactionTemplate;

    private final MetafieldDefinitionMapper metafieldDefinitionMapper;

    public MetafieldDefinitionResponse add(int storeId, MetafieldDefinitionCreateRequest request) {
        metafieldUtils.checkWritePermission(request.getOwnerResource());
        var result = transactionTemplate.execute(status -> {
            validateDefinitionLimit(storeId);
            validateUniqueKey(storeId, request.getKey(), request.getNamespace(), request.getOwnerResource());

            var entity = MetafieldDefinition.builder()
                    .storeId(storeId)
                    .description(request.getDescription())
                    .key(request.getKey())
                    .name(request.getName())
                    .namespace(request.getNamespace())
                    .type(request.getType())
                    .ownerResource(request.getOwnerResource())
                    .pin(request.getPin())
                    .build();

            if (request.getValidations() != null) {
                entity.setValidations(request.getValidations().stream()
                        .map(validation -> new MetafieldDefinition.ValidationUpdate(validation.getName(),
                                validation.getValue().trim()))
                        .toList());
            }

            return metafieldDefinitionRepository.save(entity);
        });

        Assert.notNull(result, "result must not be null");

        return metafieldDefinitionMapper.toResponse(result);
    }

    private void validateDefinitionLimit(int storeId) {
        long countDefinitionByStore = metafieldDefinitionRepository.countByStoreId(storeId);
        if (countDefinitionByStore > 250) {
            throwConstraintViolationException("resource_type_limit_exceeded", "Stores can only have 250 definitions for each store resource.");
        }
    }

    private void throwConstraintViolationException(String code, String message, String... fields) {
        throw new ConstraintViolationException(
                UserError.builder()
                        .code(code)
                        .message(message)
                        .fields(Arrays.asList(fields))
                        .build()
        );
    }

    private void validateUniqueKey(int storeId, String key, String namespace, MetafieldDefinitionOwnerType ownerResource) {
        metafieldDefinitionRepository.findByStoreIdAndKeyAndNamespaceAndOwnerResource(storeId, key, namespace, ownerResource).ifPresent(definition -> throwConstraintViolationException("taken", String.format("Key is in use for %s metafields on the '%s' namespace.", ownerResource.name(), namespace), "key"));
    }
}
