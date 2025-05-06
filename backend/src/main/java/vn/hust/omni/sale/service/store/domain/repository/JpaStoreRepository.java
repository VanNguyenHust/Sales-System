package vn.hust.omni.sale.service.store.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.hust.omni.sale.service.store.domain.model.Store;

import java.util.Optional;

public interface JpaStoreRepository extends JpaRepository<Store, Integer>, JpaSpecificationExecutor<Store> {
    Optional<Store> findByName(String name);

    Optional<Store> findByEmail(String email);

    Optional<Store> findByAlias(String alias);
}
