package vn.hust.omni.sale.service.store.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.store.domain.model.ResetPassword;

public interface JpaResetPasswordRepository extends JpaRepository<ResetPassword, Integer> {

}
