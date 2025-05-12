package vn.hust.omni.sale.service.store.application.service.mapper;

import org.mapstruct.*;
import vn.hust.omni.sale.service.store.application.model.location.LocationCreateRequest;
import vn.hust.omni.sale.service.store.application.model.location.LocationResponse;
import vn.hust.omni.sale.service.store.application.model.location.LocationUpdateRequest;
import vn.hust.omni.sale.service.store.domain.model.Location;

@Mapper(componentModel = "spring", uses = {WarpOptional.class})
public interface LocationMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "code", target = "code", qualifiedByName = "unwrap")
    @Mapping(source = "email", target = "email", qualifiedByName = "unwrap")
    @Mapping(source = "phone", target = "phone", qualifiedByName = "unwrap")
    @Mapping(source = "countryCode", target = "countryCode", qualifiedByName = "unwrap")
    @Mapping(source = "provinceCode", target = "provinceCode", qualifiedByName = "unwrap")
    @Mapping(source = "districtCode", target = "districtCode", qualifiedByName = "unwrap")
    @Mapping(source = "wardCode", target = "wardCode", qualifiedByName = "unwrap")
    @Mapping(source = "address1", target = "address1", qualifiedByName = "unwrap")
    void mapDtoToEntity(LocationCreateRequest request, @MappingTarget Location location);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "code", target = "code", qualifiedByName = "unwrap")
    @Mapping(source = "email", target = "email", qualifiedByName = "unwrap")
    @Mapping(source = "phone", target = "phone", qualifiedByName = "unwrap")
    @Mapping(source = "countryCode", target = "countryCode", qualifiedByName = "unwrap")
    @Mapping(source = "provinceCode", target = "provinceCode", qualifiedByName = "unwrap")
    @Mapping(source = "districtCode", target = "districtCode", qualifiedByName = "unwrap")
    @Mapping(source = "wardCode", target = "wardCode", qualifiedByName = "unwrap")
    @Mapping(source = "address1", target = "address1", qualifiedByName = "unwrap")
    void mapDtoToEntity(LocationUpdateRequest request, @MappingTarget Location location);

    LocationResponse toResponse(Location location);
}
