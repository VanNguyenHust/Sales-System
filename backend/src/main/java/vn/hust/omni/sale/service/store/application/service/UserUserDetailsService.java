package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.domain.model.User;
import vn.hust.omni.sale.service.store.domain.repository.JpaUserRepository;

import java.util.Arrays;

@Service("userDetailsService")
@RequiredArgsConstructor
public class UserUserDetailsService implements UserDetailsService {
    private final JpaUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Arrays.stream(StringUtils.split(user.getPermissions(), ",")).map(
                        SimpleGrantedAuthority::new
                ).toList()
        );
    }
}
