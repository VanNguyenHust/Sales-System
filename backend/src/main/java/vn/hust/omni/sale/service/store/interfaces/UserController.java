package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.hust.omni.sale.service.store.application.model.user.LoginRequest;
import vn.hust.omni.sale.service.store.application.model.user.LoginResponse;
import vn.hust.omni.sale.service.store.application.service.UserService;

@RestController
@RequestMapping(value = "/admin/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

}
