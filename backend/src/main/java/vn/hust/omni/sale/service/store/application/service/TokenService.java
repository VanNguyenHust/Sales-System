package vn.hust.omni.sale.service.store.application.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.domain.model.Token;
import vn.hust.omni.sale.service.store.domain.model.User;
import vn.hust.omni.sale.service.store.domain.repository.JpaTokenRepository;
import vn.hust.omni.sale.shared.common_model.ResourceType;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TokenService {
    private static final int MAX_TOKENS = 1000;
    @Value("${token.jwt.expiration}")
    private int expiration;

    @Value("${token.jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    private final JpaTokenRepository tokenRepository;

    public Token addToken(User user, String token, String clientIp) {
        var userTokens = tokenRepository.findByStoreIdAndResourceIdAndResourceType(user.getStoreId(), user.getId(), ResourceType.STORE.name());
        var tokenCount = userTokens.stream()
                .collect(Collectors.groupingBy(Token::getClientIp))
                .size();

        if (tokenCount >= MAX_TOKENS) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Tài khoản của bạn đã bị khóa do đăng nhập quá số thiết bị quy định, vui lòng liên hệ quản trị viên để được hỗ trợ.")
                            .fields(List.of("token"))
                            .build()
            );
        }
        var expirationInSeconds = expiration;
        var expirationDateTime = LocalDateTime.now().plusSeconds(expirationInSeconds);

        var newToken = Token.builder()
                .token(token)
                .tokenType("Bearer")
                .refreshToken(UUID.randomUUID().toString())
                .expirationDate(expirationDateTime)
                .refreshExpirationDate(LocalDateTime.now().plusSeconds(expirationRefreshToken))
                .revoked(false)
                .expired(false)
                .clientIp(clientIp)
                .storeId(user.getStoreId())
                .resourceId(user.getId())
                .resourceType(ResourceType.STORE.name())
                .build();

        tokenRepository.save(newToken);

        return newToken;
    }
}
