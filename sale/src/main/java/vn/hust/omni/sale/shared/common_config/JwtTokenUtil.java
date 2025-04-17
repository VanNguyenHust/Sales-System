package vn.hust.omni.sale.shared.common_config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.hust.omni.sale.service.store.domain.model.User;
import vn.hust.omni.sale.service.store.domain.repository.JpaTokenRepository;
import vn.hust.omni.sale.shared.common_config.model.JwtTokenSubjectModel;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    @Value("${token.jwt.expiration}")
    private int expiration;

    @Value("${token.jwt.secret-key}")
    private String secretKey;

    @Value("${token.jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    private final JpaTokenRepository tokenRepository;

    public String generateToken(int storeId, int resourceId, String resourceType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("storeId", storeId);
        claims.put("resourceId", resourceId);
        claims.put("resourceType", resourceType);

        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(String.format("%d-%d-%s", storeId, resourceId, resourceType))
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                    .signWith(getSignKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public String generateRefreshToken(int storeId, int resourceId, String resourceType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("storeId", storeId);
        claims.put("resourceId", resourceId);
        claims.put("resourceType", resourceType);

        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(String.format("%d-%d-%s", storeId, resourceId, resourceType))
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expirationRefreshToken * 1000L))
                    .signWith(getSignKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    private Key getSignKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);

        return expirationDate.before(new Date());
    }

    public JwtTokenSubjectModel extractToken(String token) {
        var subject = extractClaim(token, Claims::getSubject);

        var tokenParts = subject.split("-");
        if (tokenParts.length != 3) {
            return null;
        }

        return JwtTokenSubjectModel.builder()
                .storeId(Integer.parseInt(tokenParts[0]))
                .resourceId(Integer.parseInt(tokenParts[1]))
                .resourceType(tokenParts[2])
                .build();
    }

    public boolean validateToken(String token, Object accountModel) {
        try {
            final var tokenModel = extractToken(token);
            var existingToken = tokenRepository.findByToken(token).orElse(null);

            if (existingToken == null || tokenModel == null) {
                return false;
            }

            if (isTokenExpired(token) || existingToken.isRevoked()) {
                return false;
            }

            var storeId = tokenModel.getStoreId();
            var resourceId = tokenModel.getResourceId();
            var resourceType = tokenModel.getResourceType();

            switch (resourceType) {
                case "admin" -> {
                    if (accountModel instanceof User user) {
                        return storeId == user.getStoreId() && resourceId == user.getId();
                    }
                }
//                case "user" -> {
//                    if (accountModel instanceof vn.hust.omni.sale.service.store.domain.model.User user) {
//                        return storeId == user.getStoreId() && resourceId == user.getId();
//                    }
//                }
                default -> {
                    return false;
                }
            }
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}

