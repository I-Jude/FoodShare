package com.foodshare.controller;

import com.foodshare.dto.FoodRequestDTO;
import com.foodshare.security.UserPrincipal;
import com.foodshare.service.FoodRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FoodRequestController {

    private final FoodRequestService requestService;

    @PostMapping
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<FoodRequestDTO> createRequest(@Valid @RequestBody FoodRequestDTO requestDTO, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        FoodRequestDTO createdRequest = requestService.createRequest(requestDTO, userPrincipal.getId());
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @GetMapping("/{requestId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FoodRequestDTO> getRequestById(@PathVariable Long requestId) {
        FoodRequestDTO request = requestService.getRequestById(requestId);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/receiver/my-requests")
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<List<FoodRequestDTO>> getMyRequests(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<FoodRequestDTO> requests = requestService.getRequestsByReceiver(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/donor/incoming")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<FoodRequestDTO>> getIncomingRequests(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<FoodRequestDTO> requests = requestService.getRequestsByDonor(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/approve")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<FoodRequestDTO> approveRequest(@PathVariable Long requestId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        FoodRequestDTO approvedRequest = requestService.approveRequest(requestId, userPrincipal.getId());
        return ResponseEntity.ok(approvedRequest);
    }

    @PutMapping("/{requestId}/reject")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<FoodRequestDTO> rejectRequest(@PathVariable Long requestId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        FoodRequestDTO rejectedRequest = requestService.rejectRequest(requestId, userPrincipal.getId());
        return ResponseEntity.ok(rejectedRequest);
    }

    @PutMapping("/{requestId}/mark-completed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FoodRequestDTO> markAsCompleted(@PathVariable Long requestId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        FoodRequestDTO completedRequest = requestService.markAsCompleted(requestId, userPrincipal.getId());
        return ResponseEntity.ok(completedRequest);
    }

    @DeleteMapping("/{requestId}")
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<Void> cancelRequest(@PathVariable Long requestId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        requestService.cancelRequest(requestId, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
