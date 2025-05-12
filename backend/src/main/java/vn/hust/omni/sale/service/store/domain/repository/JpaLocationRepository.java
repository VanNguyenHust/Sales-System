package vn.hust.omni.sale.service.store.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import vn.hust.omni.sale.service.store.domain.model.Location;

import java.util.List;
import java.util.Optional;

public interface JpaLocationRepository extends JpaRepository<Location, Integer> {
    Optional<Location> findByIdAndStoreId(int id, int storeId);

    int countByStoreIdAndDeletedIsFalse(int storeId);

    List<Location> findTop2ByStoreIdAndNameAndDeletedIsFalse(int storeId, String name);

    List<Location> findTop2ByStoreIdAndCodeAndDeletedIsFalse(int storeId, String code);

    List<Location> findByStoreIdAndInventoryManagementAndStatusAndDeletedIsFalse(int storeId, boolean inventoryManagement, Location.Status status);

    List<Location> findByStoreIdAndDefaultLocationIsTrueAndDeletedIsFalse(int storeId);

    @Modifying
    @Transactional
    @Query("UPDATE Location l SET l.defaultLocation = :defaultLocation WHERE l.storeId = :storeId AND l.id = :id")
    void updateDefaultLocationByIdAndStoreId(int id, int storeId, boolean defaultLocation);
}
