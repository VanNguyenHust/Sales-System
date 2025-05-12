package vn.hust.omni.sale.service.product.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.product.application.model.ProductFilterRequest;
import vn.hust.omni.sale.service.product.application.model.ProductResponse;
import vn.hust.omni.sale.service.product.application.service.mapper.ProductMapper;
import vn.hust.omni.sale.service.product.domain.model.Product;
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
    private final ProductMapper productMapper;

    public long count(int storeId, ProductFilterRequest filter) {
        var specification = Specification.where(ProductSpecification.hasStoreId(storeId));
//        if (filter != null) {
//            specification = specification.and(ProductSpecification.filter(filter));
//        }
        return productRepository.count(specification);
    }

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
//        enrichInventoryResponses(storeId, result);
        return result;
    }

    private List<ProductResponse> internalGetProductResponseByProducts(int storeId, List<Product> products) {
        var productIds = products.stream().map(Product::getId).toList();
        var productListResponse = new ArrayList<ProductResponse>();
        if (products.isEmpty()) return productListResponse;

        productListResponse = new ArrayList<>(
                products.stream()
                        .map(product -> productMapper.toResponse(product))
                        .sorted(Comparator.comparing(ProductResponse::getName))
                        .toList()
        );

        return productListResponse;
    }

}
