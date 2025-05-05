package vn.hust.omni.sale.service.store.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.store.domain.model.StoreRole;

import java.util.List;
import java.util.Optional;

public interface JpaStoreRoleRepository extends JpaRepository<StoreRole, Long> {
    List<StoreRole> findByStoreId(long storeId);

    Optional<StoreRole> findByIdAndStoreId(long id, long storeId);
}
