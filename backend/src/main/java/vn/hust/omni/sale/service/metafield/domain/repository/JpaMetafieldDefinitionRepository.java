package vn.hust.omni.sale.service.metafield.domain.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionCount;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.metafield.infrastructure.specification.MetafieldDefinitionSpecification;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface JpaMetafieldDefinitionRepository extends JpaRepository<MetafieldDefinition, Integer> {
    int countByStoreId(int storeId);

    Optional<MetafieldDefinition> findByStoreIdAndKeyAndNamespaceAndOwnerResource(int storeId, String key,
                                                                                  String namespace,
                                                                                  MetafieldDefinitionOwnerType ownerResource);

    Optional<MetafieldDefinition> findByStoreIdAndId(int storeId, int id);

    @Query("from MetafieldDefinition md left join fetch md.validations where md.storeId = :storeId and md.id = :id")
    Optional<MetafieldDefinition> findOneWithValidations(int storeId, int id);

    MetafieldDefinition findByNamespaceAndKeyAndOwnerResourceAndStoreId(String namespace, String key,
                                                                                  MetafieldDefinitionOwnerType ownerResource,
                                                                                  int storeId);

    default List<MetafieldDefinition> findAllWithValidations(Specification<MetafieldDefinition> spec, Pageable pageable) {
        var items = findAll(spec, pageable);
        var ids = items.stream().map(MetafieldDefinition::getId).toList();
        if (ids.isEmpty()) {
            return List.of();
        }
        return findByIdsWithValidations(ids).stream()
                .sorted(Comparator.comparing((a) -> ids.indexOf(a.getId())))
                .collect(Collectors.toList());
    }

    @Query(value = "SELECT COUNT(md.id) AS count, md.owner_resource AS ownerResource " +
                   "FROM metafield_definitions md WHERE md.store_id = :storeId GROUP BY md.owner_resource",
            nativeQuery = true)
    List<MetafieldDefinitionCount> countByOwnerResource(int storeId);

    default List<MetafieldDefinition> findByValidations(int storeId, MetafieldDefinitionOwnerType ownerResource) {
        var items = findAll(Specification.where(MetafieldDefinitionSpecification.hasStoreId(storeId))
                .and(MetafieldDefinitionSpecification.hasOwnerResource(ownerResource)));
        var ids = items.stream().map(MetafieldDefinition::getId).toList();
        if (ids.isEmpty()) {
            return List.of();
        }
        return findByIdsWithValidations(ids).stream()
                .sorted(Comparator.comparing((a) -> ids.indexOf(a.getId())))
                .collect(Collectors.toList());
    }

    @Query("from MetafieldDefinition md left join fetch md.validations where md.id in :ids")
    List<MetafieldDefinition> findByIdsWithValidations(@Param("ids") Collection<Integer> ids);

    List<MetafieldDefinition> findAll(Specification<MetafieldDefinition> spec, Pageable pageable);

    List<MetafieldDefinition> findAll(Specification<MetafieldDefinition> spec);

    long count(Specification<MetafieldDefinition> specification);
}
