package vn.hust.omni.sale.service.store.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.hust.omni.sale.service.store.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByStoreIdAndId(int storeId, int id);

    Optional<User> findByStoreIdAndEmail(int storeId, String email);

    @Query("SELECT u FROM User u WHERE u.storeId = :storeId AND u.accountOwner = true")
    User findOwnerAccount(@Param("storeId") int storeId);

    List<User> findAllByStoreId(int storeId);
}
