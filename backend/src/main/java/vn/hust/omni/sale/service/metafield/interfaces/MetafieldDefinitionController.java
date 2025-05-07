package vn.hust.omni.sale.service.metafield.interfaces;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionCreateRequest;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionUpdateRequest;
import vn.hust.omni.sale.service.metafield.application.service.definition.MetafieldDefinitionService;
import vn.hust.omni.sale.service.store.application.constant.StoreFeatures;
import vn.hust.omni.sale.service.store.application.service.StoreFeatureService;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;
import vn.hust.omni.sale.shared.security.StoreId;

@RestController
@RequestMapping("/admin/metafield_definitions")
@RequiredArgsConstructor
public class MetafieldDefinitionController {
    private final MetafieldDefinitionService metafieldDefinitionService;
    private final StoreFeatureService storeFeatureService;

    private void checkFeatureAccessMetafieldDefinition(int storeId) {
        if (!storeFeatureService.isFeatureEnabled(storeId, StoreFeatures.manage_metafield_definitions.name())) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .code("not_supported")
                            .message("Feature is not supported for this store")
                            .build()
            );
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MetafieldDefinitionResponse add(
            @StoreId int storeId, @Valid @RequestBody MetafieldDefinitionCreateRequest model) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.add(storeId, model);
    }

    @PutMapping
    public MetafieldDefinitionResponse update(
            @StoreId int storeId, @Valid @RequestBody MetafieldDefinitionUpdateRequest model) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.update(storeId, model);
    }
}
