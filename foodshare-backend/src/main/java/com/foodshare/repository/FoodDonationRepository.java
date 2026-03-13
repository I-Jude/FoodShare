package com.foodshare.repository;

import com.foodshare.entity.FoodDonation;
import com.foodshare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {
    List<FoodDonation> findByDonor(User donor);

    List<FoodDonation> findByStatus(FoodDonation.DonationStatus status);

    @Query("SELECT f FROM FoodDonation f WHERE f.status = 'AVAILABLE' OR f.status = 'PARTIALLY_CLAIMED'")
    List<FoodDonation> findAvailableDonations();

    @Query("SELECT f FROM FoodDonation f WHERE " +
           "f.status IN ('AVAILABLE', 'PARTIALLY_CLAIMED') AND " +
           "(:location IS NULL OR LOWER(f.pickupLocation) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:foodType IS NULL OR LOWER(f.foodItems) LIKE LOWER(CONCAT('%', :foodType, '%'))) AND " +
           "(:availableFrom IS NULL OR f.availableUntil > :availableFrom)")
    List<FoodDonation> searchDonations(
        @Param("location") String location,
        @Param("foodType") String foodType,
        @Param("availableFrom") LocalDateTime availableFrom
    );
}
