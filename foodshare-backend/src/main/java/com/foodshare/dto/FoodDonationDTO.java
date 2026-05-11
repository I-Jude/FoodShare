package com.foodshare.dto;

import com.foodshare.entity.FoodDonation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodDonationDTO {

    private Long id;

    @NotBlank(message = "Event name is required")
    private String eventName;

    private String description;

    @NotBlank(message = "Food items are required")
    private String foodItems;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    private Double latitude;

    private Double longitude;

    @NotNull(message = "Available from time is required")
    private LocalDateTime availableFrom;

    @NotNull(message = "Available until time is required")
    private LocalDateTime availableUntil;

    private Double price;

    private String imagePath;

    private String paymentType;

    private String status;

    private Long donorId;

    private String donorName;

    private LocalDateTime createdAt;

    public static FoodDonationDTO fromEntity(FoodDonation donation) {
        FoodDonationDTO dto = new FoodDonationDTO();
        dto.setId(donation.getId());
        dto.setEventName(donation.getEventName());
        dto.setDescription(donation.getDescription());
        dto.setFoodItems(donation.getFoodItems());
        dto.setQuantity(donation.getQuantity());
        dto.setUnit(donation.getUnit());
        dto.setPickupLocation(donation.getPickupLocation());
        dto.setLatitude(donation.getLatitude());
        dto.setLongitude(donation.getLongitude());
        dto.setAvailableFrom(donation.getAvailableFrom());
        dto.setAvailableUntil(donation.getAvailableUntil());
        dto.setPrice(donation.getPrice());
        dto.setImagePath(donation.getImagePath());
        dto.setPaymentType(donation.getPaymentType());
        dto.setStatus(donation.getStatus().name());
        dto.setDonorId(donation.getDonor().getId());
        dto.setDonorName(donation.getDonor().getFullName());
        dto.setCreatedAt(donation.getCreatedAt());
        return dto;
    }
}
