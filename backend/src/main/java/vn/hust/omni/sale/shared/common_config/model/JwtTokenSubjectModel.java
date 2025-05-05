package vn.hust.omni.sale.shared.common_config.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtTokenSubjectModel {
    private int storeId;
    private String storeAlias;
    private int authorId;
    private String authorType;
}
