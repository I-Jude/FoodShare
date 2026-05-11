package com.foodshare.controller;

import com.foodshare.entity.FoodRequest;
import com.foodshare.repository.FoodRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final FoodRequestRepository foodRequestRepository;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('DELIVERY_PARTNER') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllDeliveryOrders() {
        List<FoodRequest> approvedRequests = foodRequestRepository.findByStatus(FoodRequest.RequestStatus.APPROVED);
        
        List<Map<String, Object>> response = approvedRequests.stream().map(request -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", request.getId());
            map.put("eventName", request.getDonation().getEventName());
            map.put("foodItems", request.getDonation().getFoodItems());
            map.put("quantity", request.getQuantityRequested());
            map.put("pickupLocation", request.getDonation().getPickupLocation());
            map.put("deliveryAddress", request.getReceiver().getAddress());
            map.put("receiverName", request.getReceiver().getFullName());
            map.put("receiverPhone", request.getReceiver().getPhoneNumber());
            map.put("donorName", request.getDonation().getDonor().getFullName());
            map.put("donorPhone", request.getDonation().getDonor().getPhoneNumber());
            map.put("imagePath", request.getDonation().getImagePath());
            map.put("status", request.getStatus());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
