package org.itmo.isLab1.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import org.itmo.isLab1.auth.JwtAuthenticationFilter;
import org.itmo.isLab1.utils.crypto.Sha512PasswordEncoder;
import org.itmo.isLab1.users.UserService;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserService userService;

    private static final List<String> crudResources = Arrays.asList(
        "dragons",
        "coordinates",
        "caves",
        "persons",
        "heads",
        "locations"
    );

    @Bean
    @Order(1)
    public SecurityFilterChain websocketSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/ws/**")
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .sessionManagement(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            // Отключаем CORS
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfiguration = new CorsConfiguration();
                corsConfiguration.setAllowedOrigins(List.of(
                    "http://localhost:3000", 
                    "http://localhost:5000", 
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:16123",
                    "http://localhost:16123"
                ));
                corsConfiguration.setAllowedMethods(List.of(
                    "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD", "CONNECT", "OPTIONS"
                ));
                corsConfiguration.setAllowedHeaders(List.of("*"));
                corsConfiguration.setAllowCredentials(true);
                corsConfiguration.setMaxAge(10L);
                corsConfiguration.addExposedHeader("X-Response-Uuid");
                corsConfiguration.addExposedHeader("X-Total-Count");
                return corsConfiguration;
            }))
            .authorizeHttpRequests(request -> {
                request
                    // Доступ к методам /api/auth/** открыт для всех
                    .requestMatchers("/api/auth/**").permitAll();

                request
                    // Доступ к данным запросов на администрирование
                    .requestMatchers(HttpMethod.GET, "/api/admin-requests/pending").hasRole("ADMIN") // только админы могут просматривать все ожидающие запросы
                    .requestMatchers(HttpMethod.GET, "/api/admin-requests/**").authenticated() // только авторизованные могут читать данные
                    .requestMatchers(HttpMethod.POST, "/api/admin-requests/**").hasRole("USER") // подавать запросы могут только пользователи
                    .requestMatchers(HttpMethod.PUT, "/api/admin-requests/**").hasRole("ADMIN"); // рассматривать запросы могут только админы

                request
                    // Доступ к специальным операциям над объектами
                    .requestMatchers(HttpMethod.GET, "/api/operations/age/less-than").permitAll() // рассчитать среднее значение поля age для всех объектов
                    .requestMatchers(HttpMethod.GET, "/api/operations/deepest-dragon").permitAll() // вернуть один (любой) объект, значение поля age которого является максимальным
                    .requestMatchers(HttpMethod.GET, "/api/operations/description/less-than").permitAll() // вернуть массив объектов, значение поля name которых начинается с заданной подстроки
                    .requestMatchers(HttpMethod.GET, "/api/operations/unique-colors").permitAll() // найти дракона, живущего в самой глубокой пещере
                    .requestMatchers(HttpMethod.DELETE, "/api/operations/kill/**").authenticated(); // убить указанного дракона

                crudResources.forEach(resource ->
                    request
                        // Доступ к данным ресурса
                        .requestMatchers(HttpMethod.GET, "/api/" + resource + "/**").permitAll() // все пользователи могут читать данные
                        .requestMatchers(HttpMethod.POST, "/api/" + resource + "/**").authenticated() // только авторизованные могут создавать данные
                        .requestMatchers(HttpMethod.PUT, "/api/" + resource + "/**").authenticated() // обновление доступно только авторам или администраторам
                        .requestMatchers(HttpMethod.PATCH, "/api/" + resource + "/**").authenticated() // обновление доступно только авторам или администраторам
                        .requestMatchers(HttpMethod.DELETE, "/api/" + resource + "/**").authenticated() // удаление доступно только авторам или администраторам
                );

                request
                    // Любой другой запрос должен быть аутентифицирован
                    .anyRequest().authenticated();
            })
            .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Sha512PasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService.userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}