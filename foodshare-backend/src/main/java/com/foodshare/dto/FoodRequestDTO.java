package com.foodshare.dto;

import com.foodshare.entity.FoodRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodRequestDTO {

    private Long id;

    @NotNull(message = "Donation ID is required")
    private Long donationId;

    @NotNull(message = "Quantity requested is required")
    @Positive(message = "Quantity must be positive")
    private Double quantityRequested;

    private String message;

    private String status;

    private Long receiverId;

    private String receiverName;

    private String receiverPhone;

    private FoodDonationDTO donation;

    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;

    private LocalDateTime pickupAt;

    public static FoodRequestDTO fromEntity(FoodRequest request) {
        FoodRequestDTO dto = new FoodRequestDTO();
        dto.setId(request.getId());
        dto.setDonationId(request.getDonation().getId());
        dto.setQuantityRequested(request.getQuantityRequested());
        dto.setMessage(request.getMessage());
        dto.setStatus(request.getStatus().name());
        dto.setReceiverId(request.getReceiver().getId());
        dto.setReceiverName(request.getReceiver().getFullName());
        dto.setReceiverPhone(request.getReceiver().getPhoneNumber());
        dto.setDonation(FoodDonationDTO.fromEntity(request.getDonation()));
        dto.setRequestedAt(request.getRequestedAt());
        dto.setRespondedAt(request.getRespondedAt());
        dto.setPickupAt(request.getPickupAt());
        return dto;
    }
}
