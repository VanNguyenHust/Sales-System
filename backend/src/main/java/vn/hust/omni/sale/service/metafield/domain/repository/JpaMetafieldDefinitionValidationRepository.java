package vn.hust.omni.sale.service.metafield.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

public interface JpaMetafieldDefinitionValidationRepository extends JpaRepository<MetafieldDefinitionValidation, Integer>, JpaSpecificationExecutor<MetafieldDefinitionValidation> {
}
