package com.example.btldoan.repositories;

import com.example.btldoan.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("Select r from Rating r where r.product.id=:productId")
    List<Review> getAllProductsReview(@Param("productId") Long productId);
}
