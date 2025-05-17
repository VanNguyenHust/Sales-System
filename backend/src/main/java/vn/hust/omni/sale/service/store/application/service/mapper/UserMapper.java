package vn.hust.omni.sale.service.store.application.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import vn.hust.omni.sale.service.store.application.model.user.UserResponse;
import vn.hust.omni.sale.service.store.domain.model.User;

import java.util.Arrays;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "permissions", source = "user", qualifiedByName = "mapPermissions")
    UserResponse toResponse(User user);

    @Named("mapPermissions")
    default List<String> mapPermissions(User user) {
        return Arrays.stream(user.getPermissions().split(","))
                .map(String::trim)
                .toList();
    }
}
