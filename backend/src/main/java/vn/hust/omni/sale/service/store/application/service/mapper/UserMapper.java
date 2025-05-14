package vn.hust.omni.sale.service.store.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.store.application.model.user.UserResponse;
import vn.hust.omni.sale.service.store.domain.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
