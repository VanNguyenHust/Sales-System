package vn.hust.omni.sale.shared.common_config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.hust.omni.sale.service.store.domain.repository.JpaUserRepository;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;
    private final JpaUserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            if (isBypassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            if ("OPTIONS".equals(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = null;
            final String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }

            if (token == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No valid authorization token found");
                return;
            }

            final var tokenModel = jwtTokenUtil.extractToken(token);
            if (tokenModel != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var storeId = tokenModel.getStoreId();
                var resourceId = tokenModel.getResourceId();
                var resourceType = tokenModel.getResourceType();

                Optional<?> accountModelOptional;
                switch (resourceType) {
                    case "admin" -> accountModelOptional = userRepository.findByStoreIdAndId(storeId, resourceId);
//                    case "user" -> accountModelOptional = userRepository.findById(tokenModel.getResourceId());
                    default -> {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                        return;
                    }
                }

                if (accountModelOptional.isEmpty()) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }

                var accountModel = accountModelOptional.get();
                if (jwtTokenUtil.validateToken(token, accountModel)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            accountModel, null);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(e.getMessage());
        }
    }

    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                // Healthcheck request, no JWT token required
//                Pair.of(String.format("%s/healthcheck/health", apiPrefix), "GET"),
//                Pair.of(String.format("%s/actuator/**", apiPrefix), "GET"),

                Pair.of("/administrator/store/register", "POST"),

                // OpenAPI requests, no JWT token required
                Pair.of("/v3/api-docs/**", "GET"),
                Pair.of("/swagger-ui/**", "GET")
        );

        String requestPath = request.getServletPath();
        String requestMethod = request.getMethod();

        for (Pair<String, String> token : bypassTokens) {
            String path = token.getFirst();
            String method = token.getSecond();

            if (requestPath.matches(path.replace("**", ".*")) && requestMethod.equalsIgnoreCase(method)) {
                return true;
            }
        }
        return false;
    }
}

