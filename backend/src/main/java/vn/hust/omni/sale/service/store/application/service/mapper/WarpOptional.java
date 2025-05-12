package vn.hust.omni.sale.service.store.application.service.mapper;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class WarpOptional {

    @Named("wrap")
    public <T> Optional<T> warp(T model) {
        return Optional.ofNullable(model);
    }

    @Named("unwrap")
    public <T> T unwrap(Optional<T> model) {
        return (model == null || model.isEmpty()) ? null : model.get();
    }
}
