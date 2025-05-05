package vn.hust.omni.sale.service.store.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.store.domain.model.Token;

import java.util.List;
import java.util.Optional;

public interface JpaTokenRepository extends JpaRepository<Token, String> {
    Optional<Token> findByToken(String token);

    List<Token> findByStoreIdAndResourceIdAndResourceType(int storeId, long resourceId, String resourceType);
}
