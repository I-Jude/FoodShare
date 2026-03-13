package com.foodshare.service;

import com.foodshare.dto.FoodDonationDTO;
import com.foodshare.entity.FoodDonation;
import com.foodshare.entity.User;
import com.foodshare.exception.ResourceNotFoundException;
import com.foodshare.exception.UnauthorizedException;
import com.foodshare.repository.FoodDonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodDonationService {

    private final FoodDonationRepository donationRepository;
    private final UserService userService;

    public FoodDonationDTO createDonation(FoodDonationDTO donationDTO, Long donorId) {
        User donor = userService.getUserById(donorId);

        FoodDonation donation = new FoodDonation();
        donation.setDonor(donor);
        donation.setEventName(donationDTO.getEventName());
        donation.setDescription(donationDTO.getDescription());
        donation.setFoodItems(donationDTO.getFoodItems());
        donation.setQuantity(donationDTO.getQuantity());
        donation.setUnit(donationDTO.getUnit());
        donation.setPickupLocation(donationDTO.getPickupLocation());
        donation.setLatitude(donationDTO.getLatitude());
        donation.setLongitude(donationDTO.getLongitude());
        donation.setAvailableFrom(donationDTO.getAvailableFrom());
        donation.setAvailableUntil(donationDTO.getAvailableUntil());
        donation.setPrice(donationDTO.getPrice() != null ? donationDTO.getPrice() : 0.0);
        donation.setStatus(FoodDonation.DonationStatus.AVAILABLE);

        FoodDonation savedDonation = donationRepository.save(donation);
        return FoodDonationDTO.fromEntity(savedDonation);
    }

    public FoodDonationDTO getDonationById(Long donationId) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        return FoodDonationDTO.fromEntity(donation);
    }

    public List<FoodDonationDTO> getAllAvailableDonations() {
        return donationRepository.findAvailableDonations().stream()
                .map(FoodDonationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FoodDonationDTO> searchDonations(String location, String foodType, LocalDateTime availableFrom) {
        return donationRepository.searchDonations(location, foodType, availableFrom).stream()
                .map(FoodDonationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FoodDonationDTO> getDonationsByDonor(Long donorId) {
        User donor = userService.getUserById(donorId);
        return donationRepository.findByDonor(donor).stream()
                .map(FoodDonationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public FoodDonationDTO updateDonation(Long donationId, FoodDonationDTO donationDTO, Long userId) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        if (!donation.getDonor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own donations");
        }

        if (donationDTO.getEventName() != null) {
            donation.setEventName(donationDTO.getEventName());
        }
        if (donationDTO.getDescription() != null) {
            donation.setDescription(donationDTO.getDescription());
        }
        if (donationDTO.getFoodItems() != null) {
            donation.setFoodItems(donationDTO.getFoodItems());
        }
        if (donationDTO.getQuantity() != null) {
            donation.setQuantity(donationDTO.getQuantity());
        }
        if (donationDTO.getPickupLocation() != null) {
            donation.setPickupLocation(donationDTO.getPickupLocation());
        }
        if (donationDTO.getAvailableUntil() != null) {
            donation.setAvailableUntil(donationDTO.getAvailableUntil());
        }

        FoodDonation updatedDonation = donationRepository.save(donation);
        return FoodDonationDTO.fromEntity(updatedDonation);
    }

    public void deleteDonation(Long donationId, Long userId) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        if (!donation.getDonor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own donations");
        }

        donationRepository.delete(donation);
    }

    public void setImagePath(Long donationId, String imagePath) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        donation.setImagePath(imagePath);
        donationRepository.save(donation);
    }

    public void updateDonationStatus(Long donationId, FoodDonation.DonationStatus status) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        donation.setStatus(status);
        donationRepository.save(donation);
    }
}
