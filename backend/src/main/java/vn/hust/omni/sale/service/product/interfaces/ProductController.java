package vn.hust.omni.sale.service.product.interfaces;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldRequest;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.product.application.model.ProductRequest;
import vn.hust.omni.sale.service.product.application.model.ProductResponse;
import vn.hust.omni.sale.service.product.application.service.ProductReadService;
import vn.hust.omni.sale.service.product.application.service.ProductWriteService;
import vn.hust.omni.sale.shared.security.StoreId;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductWriteService productWriteService;
    private final ProductReadService productReadService;
    private final MetafieldService metafieldService;

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED)
    public ProductResponse productCreate(@RequestBody @Valid ProductRequest model, @StoreId int storeId) {
        var metafieldResults = validateAndGenerateMetafields(model.getMetafields(), storeId, MetafieldDefinitionOwnerType.product, 0);
        var id = productWriteService.createProduct(storeId, model);
        if (metafieldResults != null) metafieldService.save(metafieldResults, id);
        return productReadService.getById(storeId, id);
    }

    @PutMapping(value = "/{id}")
    public ProductResponse productUpdate(@PathVariable("id") int id, @RequestBody @Valid ProductRequest model, @StoreId int storeId) {
        var metafieldResults = validateAndGenerateMetafields(model.getMetafields(), storeId, MetafieldDefinitionOwnerType.product, id);
        productWriteService.updateProduct(id, storeId, model);
        if (metafieldResults != null) metafieldService.save(metafieldResults, id);
        return productReadService.getById(storeId, id);

    }

    private List<Metafield> validateAndGenerateMetafields(List<MetafieldRequest> metafieldRequests,
                                                          int storeId,
                                                          MetafieldDefinitionOwnerType ownerResourceType,
                                                          int ownerResourceId) {
        if (metafieldRequests != null) {
            metafieldService.validateMetafieldByTypeAndDefinition(storeId, metafieldRequests, ownerResourceType);
            return metafieldService.validateAndGenerateMetafields(storeId, ownerResourceId, ownerResourceType, metafieldRequests);
        }
        return null;
    }
}
