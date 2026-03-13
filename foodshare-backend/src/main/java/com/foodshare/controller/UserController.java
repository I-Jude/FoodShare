package com.foodshare.controller;

import com.foodshare.dto.UserDTO;
import com.foodshare.security.UserPrincipal;
import com.foodshare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserDTO userDTO = UserDTO.fromEntity(userService.getUserById(userPrincipal.getId()));
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        UserDTO userDTO = UserDTO.fromEntity(userService.getUserById(userId));
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @Valid @RequestBody UserDTO userDTO, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        if (!userId.equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).build();
        }
        UserDTO updatedUserDTO = userService.updateUser(userId, userDTO);
        return ResponseEntity.ok(updatedUserDTO);
    }
}
