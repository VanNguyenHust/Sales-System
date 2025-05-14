package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.store.application.model.user.*;
import vn.hust.omni.sale.service.store.application.service.UserService;
import vn.hust.omni.sale.shared.security.StoreId;

@RestController
@RequestMapping(value = "/admin/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public UsersResponse get(@StoreId int storeId) {
        return userService.get(storeId);
    }

    @PostMapping
    public void createUserAccount(@StoreId int storeId, CreateUserAccountRequest request) {
        userService.createUserAccount(storeId, request);
    }

    @PutMapping("/confirm_invited")
    public String confirmLinkInvited(int storeId, String email) {
        return userService.confirmLinkInvited(storeId, email);
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

    @PutMapping("/disable/{userId}")
    public void disableAccount(@StoreId int storeId, @PathVariable int userId) {
        userService.disableAccount(storeId, userId);
    }

    @PutMapping("/enable/{userId}")
    public void enableAccount(@StoreId int storeId, @PathVariable int userId) {
        userService.enableAccount(storeId, userId);
    }

    @DeleteMapping("/delete/{userId}")
    public void deleteAccount(@StoreId int storeId, @PathVariable int userId) {
        userService.deleteAccount(storeId, userId);
    }
}
