package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.application.constant.Role;
import vn.hust.omni.sale.service.store.application.model.user.*;
import vn.hust.omni.sale.service.store.application.service.mapper.UserMapper;
import vn.hust.omni.sale.service.store.domain.model.User;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreRepository;
import vn.hust.omni.sale.service.store.domain.repository.JpaUserRepository;
import vn.hust.omni.sale.shared.common_config.JwtTokenUtil;
import vn.hust.omni.sale.shared.common_model.ResourceType;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;
import vn.hust.omni.sale.shared.mail.model.SendConfirmCodeRegisterStore;
import vn.hust.omni.sale.shared.mail.model.SendInvitedManageStore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JpaUserRepository userRepository;
    private final JpaStoreRepository storeRepository;

    private final UserMapper userMapper;
    private final TokenService tokenService;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    private final ApplicationEventPublisher eventPublisher;

    public UsersResponse get(int storeId) {
        verifyPermissions(List.of(
                new SimpleGrantedAuthority("ROLE_store_settings")
        ));

        var users = userRepository.findAllByStoreId(storeId);

        return UsersResponse.builder()
                .users(users.stream()
                        .map(userMapper::toResponse)
                        .toList()
                )
                .count(users.size())
                .build();
    }

    public UserResponse getUserById(int storeId, int userId) {
        var user = userRepository.findByStoreIdAndId(storeId, userId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("userId"))
                                .build()
                ));

        return userMapper.toResponse(user);
    }

    public UserResponse getUserByToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var principal = authentication.getPrincipal();
        if (!(authentication.getPrincipal() instanceof User)) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Tài khoản không tồn tại.")
                            .fields(List.of("token"))
                            .build()
            );
        }

        return userMapper.toResponse((User) principal);
    }

    public void createOwnerAccount(int storeId, CreateUserAccountRequest request) {
        validateExistingEmail(storeId, request.getEmail());

        var user = initUserModel(storeId, request, true);

        userRepository.save(user);

        var sendConfirmCodeEvent = SendConfirmCodeRegisterStore.builder()
                .email(request.getEmail())
                .fullName(request.getFirstName() + " " + request.getLastName())
                .confirmCode(user.getConfirmCode())
                .build();

        eventPublisher.publishEvent(sendConfirmCodeEvent);
    }

    public void createUserAccount(int storeId, CreateUserAccountRequest request) {
        validateExistingEmail(storeId, request.getEmail());

        var user = initUserModel(storeId, request, false);

        userRepository.save(user);

        var sendConfirmLinkInvitedEvent = SendInvitedManageStore.builder()
                .email(request.getEmail())
                .fullName(request.getFirstName() + " " + request.getLastName())
                .confirmCode(user.getConfirmCode())
                .build();

        eventPublisher.publishEvent(sendConfirmLinkInvitedEvent);
    }

    public String confirmLinkInvited(int storeId, String email) {
        var user = userRepository.findByStoreIdAndEmail(storeId, email)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("email"))
                                .build()
                ));

        verifyActiveAccount(user);

        user.setConfirmCode(UUID.randomUUID().toString().substring(0, 6));
        user.setConfirmCodeExpirationDate(Instant.now().plusSeconds(60 * 5));

        userRepository.save(user);

        return user.getConfirmCode();
    }

    public void resetPassword(ResetPasswordAccountRequest request) {
        var user = userRepository.findByStoreIdAndEmail(request.getStoreId(), request.getEmail())
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("email"))
                                .build()
                ));

        if (!user.getConfirmCode().equals(request.getTokenCode())) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mã xác nhận không đúng.")
                            .fields(List.of("tokenCode"))
                            .build()
            );
        }

        verifyNewPassword(request.getNewPassword(), request.getConfirmPassword());
        verifyActiveAccount(user);
        verifyExpiredConfirmCode(user);

        user.setPassword(passwordEncoder.encode(user.getPasswordSalt() + request.getNewPassword()));

        userRepository.save(user);
    }

    public void changePassword(ChangePasswordRequest request) {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            var authToken = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPasswordSalt() + request.getOldPassword());
            authenticationManager.authenticate(authToken);
        } catch (BadCredentialsException e) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mật khẩu cũ không đúng.")
                            .fields(List.of("oldPassword"))
                            .build()
            );
        }

        verifyNewPassword(request.getNewPassword(), request.getConfirmPassword());

        user.setPassword(passwordEncoder.encode(user.getPasswordSalt() + request.getNewPassword()));

        userRepository.save(user);
    }

    public void disableAccount(int storeId, int userId) {
        verifyPermissions(List.of(
                new SimpleGrantedAuthority("ROLE_store_settings")
        ));

        var user = userRepository.findByStoreIdAndId(storeId, userId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("userId"))
                                .build()
                ));

        user.setActive(false);
        userRepository.save(user);
    }

    public void enableAccount(int storeId, int userId) {
        verifyPermissions(List.of(
                new SimpleGrantedAuthority("ROLE_store_settings")
        ));

        var user = userRepository.findByStoreIdAndId(storeId, userId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("userId"))
                                .build()
                ));

        user.setActive(true);
        userRepository.save(user);
    }

    public void deleteAccount(int storeId, int userId) {
        verifyPermissions(List.of(
                new SimpleGrantedAuthority("ROLE_store_settings")
        ));

        var user = userRepository.findByStoreIdAndId(storeId, userId)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tài khoản không tồn tại.")
                                .fields(List.of("userId"))
                                .build()
                ));

        userRepository.delete(user);
    }

    private void verifyPermissions(List<SimpleGrantedAuthority> permissionNeeds) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var userPermissions = authentication.getAuthorities();
        permissionNeeds.stream()
                .filter(permissionNeed -> userPermissions.stream().noneMatch(permissionNeed::equals))
                .findFirst()
                .ifPresent(permissionNeed -> {
                    throw new ConstraintViolationException(
                            UserError.builder()
                                    .message("Không có quyền thực hiện hành động này.")
                                    .fields(List.of("permission"))
                                    .build()
                    );
                });
    }

    private void verifyNewPassword(String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mật khẩu xác nhận không khớp.")
                            .fields(List.of("password", "confirmPassword"))
                            .build()
            );
        }
    }

    private void verifyActiveAccount(User user) {
        if (user.isActive()) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Tài khoản đã được kích hoạt.")
                            .fields(List.of("email"))
                            .build()
            );
        }
    }

    private void verifyExpiredConfirmCode(User user) {
        if (user.getConfirmCodeExpirationDate() != null && Instant.now().isAfter(user.getConfirmCodeExpirationDate())) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Mã xác nhận đã hết hạn.")
                            .fields(List.of("tokenCode"))
                            .build()
            );
        }
    }

    private User initUserModel(int storeId, CreateUserAccountRequest request, boolean isOwner) {
        var user = new User();
        user.setStoreId(storeId);
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPasswordSalt(UUID.randomUUID().toString().substring(0, 10));
        user.setPassword(passwordEncoder.encode(user.getPasswordSalt() + UUID.randomUUID()));
        user.setAccountOwner(isOwner);
        user.setPermissions(isOwner ? StringUtils.join(Role.getPermissions(), ",") : request.getPermissions());
        user.setUserType("invited");
        user.setConfirmCode(UUID.randomUUID().toString().substring(0, 6));
        user.setConfirmCodeExpirationDate(Instant.now().plusSeconds(60 * 5));
        user.setActive(false);
        user.setCreatedOn(Instant.now());

        return user;
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

        verifyPasswordAuthentication(request.getEmail(), request.getPassword(), user.getPasswordSalt());

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

    public void updateUserAccount(int storeId, UpdateUserAccountRequest request) {
        var user = getUserByAuthentication();

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            validateExistingEmail(storeId, request.getEmail());
            user.setEmail(request.getEmail());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        userRepository.save(user);
    }

    private User getUserByAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        } else {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Tài khoản không tồn tại.")
                            .fields(List.of("token"))
                            .build()
            );
        }
    }

    private void verifyPasswordAuthentication(String email, String password, String passwordSalt) {
        var authToken = new UsernamePasswordAuthenticationToken(email, passwordSalt + password);
        try {
            authenticationManager.authenticate(authToken);
        } catch (BadCredentialsException e) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Sai tài khoản hoặc mật khẩu.")
                            .fields(List.of("password"))
                            .build()
            );
        }
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
