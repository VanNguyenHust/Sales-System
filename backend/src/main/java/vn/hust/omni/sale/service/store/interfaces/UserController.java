package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.store.application.model.user.*;
import vn.hust.omni.sale.service.store.application.service.UserService;
import vn.hust.omni.sale.shared.security.StoreId;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public UsersResponse get(@StoreId int storeId) {
        return userService.get(storeId);
    }

    @GetMapping("/current")
    public UserResponse getUserByToken() {
        return userService.getUserByToken();
    }

    @GetMapping("/{userId}")
    public UserResponse getUserById(@StoreId int storeId, @PathVariable int userId) {
        return userService.getUserById(storeId, userId);
    }

    @PostMapping
    public void createUserAccount(@StoreId int storeId, @RequestBody CreateUserAccountRequest request) {
        userService.createUserAccount(storeId, request);
    }

    @PutMapping("/confirm_invited")
    public String confirmLinkInvited(int storeId, String email, String confirmCode) {
        return userService.confirmLinkInvited(storeId, email, confirmCode);
    }

    @PutMapping("/reset_password")
    public void resetPassword(@RequestBody ResetPasswordAccountRequest request) {
        userService.resetPassword(request);
    }

    @PutMapping("/change_password")
    public void changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PutMapping
    public void updateUserAccount(@StoreId int storeId, @RequestBody UpdateUserAccountRequest request) {
        userService.updateUserAccount(storeId, request);
    }

    @PutMapping("/{userId}")
    public void adminUpdateUserAccount(@StoreId int storeId, @PathVariable int userId, @RequestBody UpdateUserAccountRequest request) {
        userService.adminUpdateUserAccount(storeId, userId, request);
    }

    @PutMapping("/disable")
    public void disableAccount(@StoreId int storeId, @RequestParam List<Integer> userIds) {
        userService.disableAccount(storeId, userIds);
    }

    @PutMapping("/enable")
    public void enableAccount(@StoreId int storeId, @RequestParam List<Integer> userIds) {
        userService.enableAccount(storeId, userIds);
    }

    @DeleteMapping("/delete")
    public void deleteAccount(@StoreId int storeId, @RequestParam List<Integer> userIds) {
        userService.deleteAccount(storeId, userIds);
    }
}
