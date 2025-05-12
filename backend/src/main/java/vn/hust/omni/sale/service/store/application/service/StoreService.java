package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.hust.omni.sale.service.store.application.model.store.EnableStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.RegisterStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.administrator.FilterStoresRequest;
import vn.hust.omni.sale.service.store.application.model.store.administrator.OpenLimitStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoreResponse;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoresResponse;
import vn.hust.omni.sale.service.store.application.model.store_features.InitStoreFeaturesEvent;
import vn.hust.omni.sale.service.store.application.model.user.CreateUserAccountRequest;
import vn.hust.omni.sale.service.store.application.service.mapper.StoreMapper;
import vn.hust.omni.sale.service.store.domain.model.Store;
import vn.hust.omni.sale.service.store.domain.model.Store_;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreRepository;
import vn.hust.omni.sale.service.store.domain.repository.JpaUserRepository;
import vn.hust.omni.sale.service.store.infrastructure.specification.StoreSpecification;
import vn.hust.omni.sale.shared.common_util.TextUtils;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final JpaStoreRepository storeRepository;
    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    private final ApplicationEventPublisher eventPublisher;
    private final StoreMapper storeMapper;

    @Value("${omni.store.suffix-domain}")
    private String suffixDomain;

    @Transactional
    public void registerStore(RegisterStoreRequest request) {
        storeRepository.findByName(request.getName())
                .ifPresent(existingStore -> {
                    throw new ConstraintViolationException(
                            UserError.builder()
                                    .message("Cửa hàng tên " + request.getName() + " đã tồn tại.")
                                    .fields(List.of("name"))
                                    .build()
                    );
                });

        storeRepository.findByEmail(request.getEmail())
                .ifPresent(existingStore -> {
                    throw new ConstraintViolationException(
                            UserError.builder()
                                    .message("Email " + request.getEmail() + " đã tồn tại.")
                                    .fields(List.of("email"))
                                    .build()
                    );
                });

        var store = Store.builder()
                .name(request.getName())
                .alias(TextUtils.toAlias(request.getName()))
                .domain(request.getName() + suffixDomain)
                .email(request.getEmail())
                .phoneNumber(request.getPhone())
                .createdOn(Instant.now())
                .country("Việt Nam")
                .province(request.getProvince())
                .storeOwner(request.getFirstName() + " " + request.getLastName())
                .startDate(Instant.now())
                .endDate(Instant.now().plusSeconds(60 * 60 * 24 * 30))
                .maxProduct(100)
                .maxLocation(3)
                .maxUser(10)
                .build();

        storeRepository.save(store);

        userService.createOwnerAccount(store.getId(), CreateUserAccountRequest.builder()
                .email(request.getEmail())
                .phoneNumber(request.getPhone())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build());

        eventPublisher.publishEvent(InitStoreFeaturesEvent.builder()
                .storeId(store.getId())
                .build());
    }

    @Transactional
    public void enableStore(EnableStoreRequest request) {
        var store = storeRepository.findByName(request.getName())
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Cửa hàng không tồn tại.")
                                .fields(List.of("storeAlias"))
                                .build()
                ));

        var ownerAccount = userRepository.findOwnerAccount(store.getId());

        if (!ownerAccount.getConfirmCode().equals(request.getConfirmCode())) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mã xác nhận không chính xác.")
                            .fields(List.of("confirmCode"))
                            .build()
            );
        }

        if (Instant.now().isAfter(ownerAccount.getConfirmCodeExpirationDate())) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mã xác nhận đã hết hạn.")
                            .fields(List.of("confirmCode"))
                            .build()
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mật khẩu xác nhận không khớp.")
                            .fields(List.of("password", "confirmPassword"))
                            .build()
            );
        }

        store.setStartDate(Instant.now());
        store.setEndDate(Instant.now().plusSeconds(60 * 60 * 24 * 30));
        store.setStatus(1);

        ownerAccount.setActive(true);
        ownerAccount.setPassword(passwordEncoder.encode(ownerAccount.getPasswordSalt() + request.getPassword()));

        storeRepository.save(store);
        userRepository.save(ownerAccount);
    }

    @Transactional
    public void openLimitStore(int storeId, OpenLimitStoreRequest request) {
        var store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Cửa hàng không tồn tại.")
                                .fields(List.of("storeId"))
                                .build()
                ));

        store.setMaxProduct(Objects.requireNonNullElse(request.getMaxProduct(), store.getMaxProduct()));
        store.setMaxLocation(Objects.requireNonNullElse(request.getMaxLocation(), store.getMaxLocation()));
        store.setMaxUser(Objects.requireNonNullElse(request.getMaxUser(), store.getMaxUser()));

        storeRepository.save(store);
    }

    @Transactional
    public void disableStore(int storeId) {
        var store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Cửa hàng không tồn tại.")
                                .fields(List.of("storeId"))
                                .build()
                ));

        store.setDeleted(true);
        storeRepository.save(store);
    }

    public StoreResponse getById(int storeId) {
        var store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Cửa hàng không tồn tại.")
                                .fields(List.of("storeId"))
                                .build()
                ));

        return storeMapper.toResponse(store);
    }

    public StoresResponse administratorGet(FilterStoresRequest request) {
        var specification = buildSpecification(request.getQuery(), request.getProvince(), request.getStatus());
        var pageable = PageRequest.of(request.getPage() - 1, request.getLimit(), Sort.by(Sort.Direction.DESC, Store_.CREATED_ON));

        var stores = storeRepository.findAll(specification, pageable);

        var storeResponses = stores.getContent().stream()
                .map(storeMapper::toResponse)
                .toList();

        return StoresResponse.builder()
                .stores(storeResponses)
                .count(stores.getTotalElements())
                .build();
    }

    public StoreResponse getStoreById(int storeId) {
        var store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Cửa hàng không tồn tại.")
                                .fields(List.of("storeId"))
                                .build()
                ));

        return storeMapper.toResponse(store);
    }

    private Specification<Store> buildSpecification(String query, String province, Integer status) {
        Specification<Store> specification = Specification.where(null);

        if (query != null && !query.isEmpty()) {
            specification = specification.and(StoreSpecification.hasName(query))
                    .or(StoreSpecification.hasPhoneNumber(query))
                    .or(StoreSpecification.hasEmail(query))
                    .or(StoreSpecification.hasStoreOwner(query));
        }

        if (province != null && !province.isEmpty()) {
            specification = specification.and(StoreSpecification.hasProvince(province));
        }

        if (status != null) {
            specification = specification.and(StoreSpecification.hasStatus(status));
        }

        return specification;
    }
}
