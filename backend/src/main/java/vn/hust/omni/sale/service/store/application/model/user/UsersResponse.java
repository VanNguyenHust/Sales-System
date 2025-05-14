package vn.hust.omni.sale.service.store.application.model.user;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UsersResponse {
    private List<UserResponse> users;
    private long count;
}
