package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.application.model.store.RegisterStoreRequest;
import vn.hust.omni.sale.service.store.domain.model.Store;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreRepository;
import vn.hust.omni.sale.shared.common_util.TextUtils;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final JpaStoreRepository storeRepository;

    @Value("${omni.store.suffix-domain}")
    private String suffixDomain;

    public void registerStore(RegisterStoreRequest request) {
        storeRepository.findByName(request.getName())
                .ifPresent(existingStore -> {
                    throw new ConstraintViolationException(
                            UserError.builder()
                                    .message("Store with name " + request.getName() + " already exists.")
                                    .fields(List.of("name"))
                                    .build()
                    );
                });

        var store = Store.builder()
                .name(request.getName())
                .alias(TextUtils.toAlias(request.getName()))
                .domain(request.getName() + suffixDomain)
                .phoneNumber(request.getPhone())
                .startDate(Instant.now())
                .maxProduct(100)
                .maxLocation(3)
                .maxUser(10)
                .build();

        storeRepository.save(store);
    }
}
