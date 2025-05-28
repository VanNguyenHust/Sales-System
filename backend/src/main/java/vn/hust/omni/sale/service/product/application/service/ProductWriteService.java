package vn.hust.omni.sale.service.product.application.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import vn.hust.omni.sale.service.product.application.model.*;
import vn.hust.omni.sale.service.product.application.service.mapper.ProductMapper;
import vn.hust.omni.sale.service.product.domain.model.*;
import vn.hust.omni.sale.service.product.domain.repository.JpaInventoryRepository;
import vn.hust.omni.sale.service.product.domain.repository.JpaProductRepository;
import vn.hust.omni.sale.shared.ApiClient;
import vn.hust.omni.sale.shared.common_util.OptionalUtils;
import vn.hust.omni.sale.shared.common_util.TextUtils;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.NotFoundException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductWriteService {
    private final JpaProductRepository productRepository;
    private final JpaInventoryRepository inventoryRepository;
    private final ApiClient apiClient;

    private final ProductMapper productMapper;
    private final TransactionTemplate transactionTemplate;

    public int createProduct(int storeId, ProductRequest productRequest) {
        var name = OptionalUtils.getValue(productRequest.getName());
        if (StringUtils.isBlank(name)) {
            throw new ConstraintViolationException("name", "must not be blank");
        }

        var store = apiClient.storeGetById(storeId);
        var productCount = apiClient.filterCountProduct(storeId, new ProductSearchRequest());
        if (productCount >= store.getMaxProduct()) {
            throw new ConstraintViolationException("product_quantity", "maximum is " + store.getMaxProduct());
        }

        var productId = transactionTemplate.execute(status -> {
            productRepository.findByAliasAndStoreId(TextUtils.toAlias(OptionalUtils.getValue(productRequest.getName())), storeId)
                    .ifPresent(product -> {
                        throw new ConstraintViolationException(UserError.builder()
                                .message("Tên sản phẩm đã tồn tại")
                                .fields(List.of("name"))
                                .build());
                    });

            var images = mapProductImages(productRequest.getImages());
            var pricingInfo = mapProductPricingInfo(productRequest.getPricingInfo());
            var productTags = mapProductTags(productRequest.getTags());

            var product = Product.builder()
                    .storeId(storeId)
                    .name(name)
                    .alias(TextUtils.toAlias(OptionalUtils.getValue(productRequest.getName())))
                    .content(OptionalUtils.getValue(productRequest.getContent()))
                    .summary(OptionalUtils.getValue(productRequest.getSummary()))
                    .unit(OptionalUtils.getValue(productRequest.getUnit()))
                    .isPublished(OptionalUtils.getValue(productRequest.getIsPublished()))
                    .publishedOn(OptionalUtils.getValue(productRequest.getPublishedOn()))
                    .tags(productTags)
                    .pricingInfo(pricingInfo)
                    .images(images)
                    .build();

            productRepository.save(product);

            var inventories = mapInventoryLevels(product.getId(), productRequest.getInventories());
            inventoryRepository.saveAll(inventories);

            return product.getId();
        });

        return productId;
    }

    @Transactional
    public void updateProduct(int productId, int storeId, ProductRequest productRequest) {
        var product = productRepository.getByIdAndStoreId(productId, storeId);
        if (product == null) throw new NotFoundException("product not exists");
        if (Optional.ofNullable(productRequest.getName()).isPresent())
            product.setName(productRequest.getName().orElse(null));

        if (Optional.ofNullable(productRequest.getContent()).isPresent()) {
            product.setContent(productRequest.getContent().orElse(""));
        }

        if (Optional.ofNullable(productRequest.getSummary()).isPresent()) {
            product.setSummary(productRequest.getSummary().orElse(""));
        }

        if (Optional.ofNullable(productRequest.getUnit()).isPresent()) {
            product.setUnit(productRequest.getUnit().orElse(""));
        }

        if (productRequest.getTags() != null && !productRequest.getTags().isEmpty()) {
            product.setTags(mapProductTags(productRequest.getTags()));
        } else {
            product.setTags(Set.of());
        }

        if (productRequest.getInventories() != null && !productRequest.getInventories().isEmpty()) {
            var inventories = mapInventoryLevels(productId, productRequest.getInventories());
            inventoryRepository.saveAll(inventories);
        }

        if (product.getImages() != null && !productRequest.getImages().isEmpty()) {
            product.setImages(mapProductImages(productRequest.getImages()));
        } else {
            product.setImages(List.of());
        }

        var images = mapProductImages(productRequest.getImages());
        var pricingInfo = mapProductPricingInfo(productRequest.getPricingInfo());

//        product.setStatusAndPublishedOn(productRequest.getStatus(), productRequest.getPublishedOn());

//        productRepository.store(product, actorInfo, authorInfo);
    }

    private List<ProductImage> mapProductImages(List<ProductImageRequest> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }
        return images.stream()
                .map(image -> ProductImage.builder()
                        .alt(OptionalUtils.getValue(image.getAlt()))
                        .src(image.getSrc())
                        .filename(image.getFilename())
                        .build())
                .collect(Collectors.toList());
    }

    private Set<ProductTag> mapProductTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return Set.of();
        }
        return tags.stream()
                .map(tagName -> new ProductTag(tagName, TextUtils.toAlias(tagName)))
                .collect(Collectors.toSet());
    }

    private ProductPricingInfo mapProductPricingInfo(ProductPricingInfoRequest pricingInfo) {
        if (pricingInfo == null) {
            return ProductPricingInfo.builder().build();
        }
        return ProductPricingInfo.builder()
                .price(pricingInfo.getPrice())
                .compareAtPrice(pricingInfo.getCompareAtPrice())
                .costPrice(pricingInfo.getCostPrice())
                .build();
    }

    private List<InventoryLevel> mapInventoryLevels(int productId, List<InventoryRequest> inventory) {
        if (inventory == null || inventory.isEmpty()) {
            return List.of();
        }
        return inventory.stream()
                .map(inventoryRequest -> InventoryLevel.builder()
                        .storeId(inventoryRequest.getStoreId())
                        .productId(productId)
                        .locationId(inventoryRequest.getLocationId())
                        .quantity(inventoryRequest.getQuantity())
                        .saleAvailable(inventoryRequest.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }
}
