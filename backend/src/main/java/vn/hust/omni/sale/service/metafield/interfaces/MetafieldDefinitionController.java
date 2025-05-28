package vn.hust.omni.sale.service.metafield.interfaces;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.*;
import vn.hust.omni.sale.service.metafield.application.service.definition.MetafieldDefinitionService;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.store.application.constant.StoreFeatures;
import vn.hust.omni.sale.service.store.application.service.StoreFeatureService;
import vn.hust.omni.sale.shared.common_model.CountResponse;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;
import vn.hust.omni.sale.shared.security.StoreId;

import java.util.List;

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

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @StoreId int storeId,
            @PathVariable("id") int id,
            @RequestParam(name = "delete_all_associated_metafields", defaultValue = "false")
            boolean deleteAllAssociatedMetafields) {
        checkFeatureAccessMetafieldDefinition(storeId);

        metafieldDefinitionService.remove(storeId, id, deleteAllAssociatedMetafields);
    }

    @GetMapping
    public List<MetafieldDefinitionResponse> filter(
            @StoreId int storeId, @Valid MetafieldDefinitionFilterRequest request) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.enrichMetafieldDataCount(storeId, metafieldDefinitionService.filter(storeId, request));
    }

    @GetMapping("{id}")
    public MetafieldDefinitionResponse getById(@StoreId int storeId, @PathVariable("id") int id) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.getById(storeId, id, true);
    }

    @GetMapping("/count")
    public CountResponse count(@StoreId int storeId, @Valid MetafieldDefinitionFilterRequest request) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.count(storeId, request);
    }

    @GetMapping("/applied_for_upsert")
    public List<AppliedMetafieldDefinitions> appliedMetafieldDefinitionsForEdit(
            @StoreId int storeId, @Valid MetafieldDefinitionFilterRequest request) {
        checkFeatureAccessMetafieldDefinition(storeId);

        var metafieldDefinitionResponses = metafieldDefinitionService.filter(storeId, request);
        return metafieldDefinitionService.appliedMetafieldDefinitionsForEdit(
                storeId, request, metafieldDefinitionResponses);
    }

    @GetMapping("/metafield_filter_values")
    public List<MetafieldDefinitionFilterResponse> metafieldFilterValues(
            @StoreId int storeId, @RequestParam(value = "owner_resource") MetafieldDefinitionOwnerType ownerResource) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.metafieldFilterValues(storeId, ownerResource);
    }

    @GetMapping("/count_by_resource")
    public List<MetafieldDefinitionCountResponse> countByResource(@StoreId int storeId) {
        checkFeatureAccessMetafieldDefinition(storeId);

        return metafieldDefinitionService.countByResource(storeId);
    }
}
