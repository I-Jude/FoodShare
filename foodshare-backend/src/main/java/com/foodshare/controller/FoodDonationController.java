package com.foodshare.controller;

import com.foodshare.dto.FoodDonationDTO;
import com.foodshare.security.UserPrincipal;
import com.foodshare.service.FoodDonationService;
import com.foodshare.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FoodDonationController {

    private final FoodDonationService donationService;
    private final FileUploadService fileUploadService;

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<FoodDonationDTO> createDonation(@Valid @RequestBody FoodDonationDTO donationDTO, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        FoodDonationDTO createdDonation = donationService.createDonation(donationDTO, userPrincipal.getId());
        return new ResponseEntity<>(createdDonation, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FoodDonationDTO>> getAllDonations() {
        List<FoodDonationDTO> donations = donationService.getAllAvailableDonations();
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/{donationId}")
    public ResponseEntity<FoodDonationDTO> getDonationById(@PathVariable Long donationId) {
        FoodDonationDTO donation = donationService.getDonationById(donationId);
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodDonationDTO>> searchDonations(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String foodType,
            @RequestParam(required = false) String availableFrom) {

        LocalDateTime availableFromTime = null;
        if (availableFrom != null) {
            availableFromTime = LocalDateTime.parse(availableFrom);
        }

        List<FoodDonationDTO> donations = donationService.searchDonations(location, foodType, availableFromTime);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<FoodDonationDTO>> getDonationsByDonor(@PathVariable Long donorId) {
        List<FoodDonationDTO> donations = donationService.getDonationsByDonor(donorId);
        return ResponseEntity.ok(donations);
    }

    @PutMapping("/{donationId}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<FoodDonationDTO> updateDonation(
            @PathVariable Long donationId,
            @Valid @RequestBody FoodDonationDTO donationDTO,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        FoodDonationDTO updatedDonation = donationService.updateDonation(donationId, donationDTO, userPrincipal.getId());
        return ResponseEntity.ok(updatedDonation);
    }

    @DeleteMapping("/{donationId}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long donationId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        donationService.deleteDonation(donationId, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{donationId}/upload-image")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<String> uploadImage(
            @PathVariable Long donationId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String imagePath = fileUploadService.uploadFile(file, userPrincipal.getId());
        donationService.setImagePath(donationId, imagePath);
        return ResponseEntity.ok(imagePath);
    }
}
