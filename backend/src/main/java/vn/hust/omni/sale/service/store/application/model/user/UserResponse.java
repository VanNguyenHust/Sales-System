package vn.hust.omni.sale.service.store.application.model.user;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponse {
    private int id;
    private String email;
    private String phoneNumber;
    private String name;
    private String firstName;
    private String lastName;
    private boolean accountOwner;
    private List<String> permissions;
}
