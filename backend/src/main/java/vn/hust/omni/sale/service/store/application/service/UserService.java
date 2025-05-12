package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.application.constant.Role;
import vn.hust.omni.sale.service.store.application.model.user.CreateUserAccountRequest;
import vn.hust.omni.sale.service.store.application.model.user.LoginRequest;
import vn.hust.omni.sale.service.store.application.model.user.LoginResponse;
import vn.hust.omni.sale.service.store.domain.model.User;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreRepository;
import vn.hust.omni.sale.service.store.domain.repository.JpaUserRepository;
import vn.hust.omni.sale.shared.common_config.JwtTokenUtil;
import vn.hust.omni.sale.shared.common_model.ResourceType;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;
import vn.hust.omni.sale.shared.mail.model.SendConfirmCodeRegisterStore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JpaUserRepository userRepository;
    private final JpaStoreRepository storeRepository;

    private final TokenService tokenService;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    private final ApplicationEventPublisher eventPublisher;

    public void createOwnerAccount(int storeId, CreateUserAccountRequest request) {
        validateExistingEmail(storeId, request.getEmail());

        var user = new User();
        user.setStoreId(storeId);
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPasswordSalt(UUID.randomUUID().toString().substring(0, 10));
        user.setPassword(passwordEncoder.encode(user.getPasswordSalt() + UUID.randomUUID()));
        user.setAccountOwner(true);
        user.setPermissions(StringUtils.join(Role.getPermissions(), ","));
        user.setUserType("invited");
        user.setConfirmCode(UUID.randomUUID().toString().substring(0, 6));
        user.setConfirmCodeExpirationDate(Instant.now().plusSeconds(60 * 5));
        user.setActive(false);
        user.setCreatedOn(Instant.now());

        userRepository.save(user);

        var sendConfirmCodeEvent = SendConfirmCodeRegisterStore.builder()
                .email(request.getEmail())
                .fullName(request.getFirstName() + " " + request.getLastName())
                .confirmCode(user.getConfirmCode())
                .build();

        eventPublisher.publishEvent(sendConfirmCodeEvent);
    }

    public LoginResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("email"))
                                .build()
                ));

        var store = storeRepository.findById(user.getStoreId())
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Cửa hàng không tồn tại.")
                                .fields(List.of("storeId"))
                                .build()
                ));

        var authToken = new UsernamePasswordAuthenticationToken(request.getEmail(), user.getPasswordSalt() + request.getPassword());
        authenticationManager.authenticate(authToken);

        var tokenModel = tokenService.addToken(user, jwtTokenUtil.generateToken(store.getId(), store.getAlias(), user.getId(), ResourceType.STORE.name()), UUID.randomUUID().toString());

        return LoginResponse.builder()
                .token(tokenModel.getToken())
                .refreshToken(tokenModel.getRefreshToken())
                .storeId(store.getId())
                .domain(store.getDomain())
                .resourceId(user.getId())
                .resourceType(ResourceType.STORE.name())
                .build();
    }

    private void validateExistingEmail(int storeId, String email) {
        userRepository.findByStoreIdAndEmail(storeId, email)
                .ifPresent(existingUser -> {
                    throw new ConstraintViolationException(
                            UserError.builder()
                                    .message("Tài khoản " + email + " đã tồn tại.")
                                    .fields(List.of("email"))
                                    .build()
                    );
                });
    }
}
