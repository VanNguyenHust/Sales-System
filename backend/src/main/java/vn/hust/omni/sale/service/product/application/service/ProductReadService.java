package vn.hust.omni.sale.service.product.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.product.application.model.ProductResponse;
import vn.hust.omni.sale.service.product.application.model.ProductSearchRequest;
import vn.hust.omni.sale.service.product.application.model.ProductsResponse;
import vn.hust.omni.sale.service.product.application.service.mapper.InventoryMapper;
import vn.hust.omni.sale.service.product.application.service.mapper.ProductMapper;
import vn.hust.omni.sale.service.product.domain.model.Product;
import vn.hust.omni.sale.service.product.domain.model.Product_;
import vn.hust.omni.sale.service.product.domain.repository.JpaInventoryRepository;
import vn.hust.omni.sale.service.product.domain.repository.JpaProductRepository;
import vn.hust.omni.sale.service.product.infrastructure.specification.ProductSpecification;
import vn.hust.omni.sale.shared.common_validator.exception.NotFoundException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReadService {
    private final JpaProductRepository productRepository;
    private final JpaInventoryRepository inventoryRepository;

    private final ProductMapper productMapper;
    private final InventoryMapper inventoryMapper;

    public ProductResponse getById(int storeId, int productId) {
        var result = internalGenerateProductResponseByIds(storeId, List.of(productId));
        if (result.isEmpty()) {
            throw new NotFoundException("Product not found");
        }
        return result.get(0);
    }

    private List<ProductResponse> internalGenerateProductResponseByIds(int storeId, List<Integer> productIds) {
        var specification = Specification.where(ProductSpecification.hasStoreId(storeId)).and(
                ProductSpecification.hasProductIds(productIds));

        var products = productRepository.findAll(specification);
        var result = internalGetProductResponseByProducts(storeId, products);
        enrichInventoryResponses(storeId, result);
        return result;
    }

    private void enrichInventoryResponses(int storeId, List<ProductResponse> productResponses) {
        for (var productResponse : productResponses) {
            var inventories = inventoryRepository.findByStoreIdAndProductId(storeId, productResponse.getId());

            productResponse.setInventories(
                    inventories.stream()
                            .map(inventoryMapper::toResponse)
                            .toList()
            );
        }
    }

    public ProductsResponse search(int storeId, ProductSearchRequest request) {
        var specification = buildeSpecification(storeId, request.getQuery());
        var pageable = PageRequest.of(request.getPage() - 1, request.getLimit(), Sort.by(Sort.Direction.DESC, Product_.CREATED_ON));

        var products = productRepository.findAll(specification, pageable);

        return ProductsResponse.builder()
                .products(internalGetProductResponseByProducts(storeId, products.getContent()))
                .count(products.getTotalElements())
                .build();
    }

    public long count(int storeId, ProductSearchRequest request) {
        var specification = buildeSpecification(storeId, request.getQuery());

        return productRepository.count(specification);
    }

    private Specification<Product> buildeSpecification(int storeId, String query) {
        var specification = Specification.where(ProductSpecification.hasStoreId(storeId));

        if (query != null && !query.isBlank()) {
            specification = specification.and(ProductSpecification.hasName(query));
        }
        return specification;
    }

    private List<ProductResponse> internalGetProductResponseByProducts(int storeId, List<Product> products) {
        var productListResponse = new ArrayList<ProductResponse>();
        if (products.isEmpty()) return productListResponse;

        productListResponse = new ArrayList<>(
                products.stream()
                        .map(productMapper::toResponse)
                        .toList()
        );

        enrichInventoryResponses(storeId, productListResponse);

        return productListResponse;
    }

}
