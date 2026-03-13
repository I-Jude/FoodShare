package com.foodshare.repository;

import com.foodshare.entity.FoodRequest;
import com.foodshare.entity.User;
import com.foodshare.entity.FoodDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodRequestRepository extends JpaRepository<FoodRequest, Long> {
    List<FoodRequest> findByReceiver(User receiver);

    List<FoodRequest> findByDonation(FoodDonation donation);

    List<FoodRequest> findByStatus(FoodRequest.RequestStatus status);

    List<FoodRequest> findByDonationDonor(User donor);
}
