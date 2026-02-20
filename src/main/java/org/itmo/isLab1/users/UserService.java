package org.itmo.isLab1.users;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.itmo.isLab1.common.errors.UserWithThisUsernameAlreadyExists;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final String SYSTEM_USER = "system";

    private final UserRepository repository;

    public User save(User user) {
        return repository.save(user);
    }

    @Transactional
    public User create(User user) {
        if (repository.existsByUsername(user.getUsername())) {
            throw new UserWithThisUsernameAlreadyExists("Пользователь с таким именем уже существует");
        }

        if (repository.count() == 0) {
            logger.info("Creating first user with ADMIN role");
            user.setRole(Role.ROLE_ADMIN);
        } else {
            user.setRole(Role.ROLE_USER);
        }
        return save(user);
    }

    public User getByUsername(String username) {
        return repository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
    }

    public UserDetailsService userDetailsService() {
        return this::getByUsername;
    }

    public String getCurrentUsername() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        var username = authentication.getName();
        if (username == null || "anonymousUser".equals(username)) {
            return null;
        }

        return username;
    }

    public User getCurrentUser() {
        var username = getCurrentUsername();
        if (username != null) {
            var user = repository.findByUsername(username).orElse(null);
            if (user != null) {
                return user;
            }
        }

        return repository.findByUsername(SYSTEM_USER).orElseGet(() -> {
            logger.info("Creating fallback SYSTEM user for no-auth mode");
            return repository.save(
                User.builder()
                    .username(SYSTEM_USER)
                    .role(Role.ROLE_ADMIN)
                    .password("NO_AUTH")
                    .build()
            );
        });
    }
}
