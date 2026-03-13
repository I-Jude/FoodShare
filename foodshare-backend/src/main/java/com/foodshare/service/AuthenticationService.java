package com.foodshare.service;

import com.foodshare.dto.AuthResponse;
import com.foodshare.dto.LoginRequest;
import com.foodshare.dto.RegisterRequest;
import com.foodshare.entity.User;
import com.foodshare.exception.UnauthorizedException;
import com.foodshare.security.JwtTokenProvider;
import com.foodshare.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest registerRequest) {
        User.UserRole role;
        try {
            role = User.UserRole.valueOf(registerRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new UnauthorizedException("Invalid role: " + registerRequest.getRole());
        }

        User user = userService.registerUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                registerRequest.getFullName(),
                registerRequest.getPhoneNumber(),
                registerRequest.getAddress(),
                role
        );

        String token = jwtTokenProvider.generateTokenFromId(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), user.getFullName());
    }

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            User user = userService.getUserByEmail(loginRequest.getEmail());
            String token = jwtTokenProvider.generateToken(authentication);

            return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), user.getFullName());
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
}
