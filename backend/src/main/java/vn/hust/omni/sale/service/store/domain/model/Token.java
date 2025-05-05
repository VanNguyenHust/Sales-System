package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "Tokens")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String token;

    private String tokenType;

    private String refreshToken;

    private LocalDateTime expirationDate;

    private LocalDateTime refreshExpirationDate;

    private boolean revoked;

    private boolean expired;

    private String clientIp;

    private int storeId;

    private long resourceId;

    private String resourceType;
}
