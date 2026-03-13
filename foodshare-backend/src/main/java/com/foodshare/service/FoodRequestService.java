package com.foodshare.service;

import com.foodshare.dto.FoodRequestDTO;
import com.foodshare.entity.FoodDonation;
import com.foodshare.entity.FoodRequest;
import com.foodshare.entity.User;
import com.foodshare.exception.ResourceNotFoundException;
import com.foodshare.exception.UnauthorizedException;
import com.foodshare.exception.ValidationException;
import com.foodshare.repository.FoodDonationRepository;
import com.foodshare.repository.FoodRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodRequestService {

    private final FoodRequestRepository requestRepository;
    private final FoodDonationRepository donationRepository;
    private final UserService userService;

    public FoodRequestDTO createRequest(FoodRequestDTO requestDTO, Long receiverId) {
        User receiver = userService.getUserById(receiverId);
        FoodDonation donation = donationRepository.findById(requestDTO.getDonationId())
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));

        if (!donation.getStatus().equals(FoodDonation.DonationStatus.AVAILABLE) &&
                !donation.getStatus().equals(FoodDonation.DonationStatus.PARTIALLY_CLAIMED)) {
            throw new ValidationException("Donation is not available for requests");
        }

        FoodRequest request = new FoodRequest();
        request.setDonation(donation);
        request.setReceiver(receiver);
        request.setQuantityRequested(requestDTO.getQuantityRequested());
        request.setMessage(requestDTO.getMessage());
        request.setStatus(FoodRequest.RequestStatus.PENDING);

        FoodRequest savedRequest = requestRepository.save(request);
        return FoodRequestDTO.fromEntity(savedRequest);
    }

    public FoodRequestDTO getRequestById(Long requestId) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        return FoodRequestDTO.fromEntity(request);
    }

    public List<FoodRequestDTO> getRequestsByReceiver(Long receiverId) {
        User receiver = userService.getUserById(receiverId);
        return requestRepository.findByReceiver(receiver).stream()
                .map(FoodRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FoodRequestDTO> getRequestsByDonor(Long donorId) {
        User donor = userService.getUserById(donorId);
        return requestRepository.findByDonationDonor(donor).stream()
                .map(FoodRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public FoodRequestDTO approveRequest(Long requestId, Long donorId) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getDonation().getDonor().getId().equals(donorId)) {
            throw new UnauthorizedException("You can only approve requests for your donations");
        }

        request.setStatus(FoodRequest.RequestStatus.APPROVED);
        request.setRespondedAt(LocalDateTime.now());

        FoodRequest updatedRequest = requestRepository.save(request);
        return FoodRequestDTO.fromEntity(updatedRequest);
    }

    public FoodRequestDTO rejectRequest(Long requestId, Long donorId) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getDonation().getDonor().getId().equals(donorId)) {
            throw new UnauthorizedException("You can only reject requests for your donations");
        }

        request.setStatus(FoodRequest.RequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());

        FoodRequest updatedRequest = requestRepository.save(request);
        return FoodRequestDTO.fromEntity(updatedRequest);
    }

    public FoodRequestDTO markAsCompleted(Long requestId, Long userId) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getReceiver().getId().equals(userId) && !request.getDonation().getDonor().getId().equals(userId)) {
            throw new UnauthorizedException("You cannot mark this request as completed");
        }

        request.setStatus(FoodRequest.RequestStatus.COMPLETED);
        request.setPickupAt(LocalDateTime.now());

        FoodRequest updatedRequest = requestRepository.save(request);
        return FoodRequestDTO.fromEntity(updatedRequest);
    }

    public FoodRequestDTO cancelRequest(Long requestId, Long receiverId) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getReceiver().getId().equals(receiverId)) {
            throw new UnauthorizedException("You can only cancel your own requests");
        }

        request.setStatus(FoodRequest.RequestStatus.CANCELLED);

        FoodRequest updatedRequest = requestRepository.save(request);
        return FoodRequestDTO.fromEntity(updatedRequest);
    }
}
