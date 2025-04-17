package vn.hust.omni.sale.service.store.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.store.domain.model.User;

import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByStoreIdAndId(int storeId, int id);
}
