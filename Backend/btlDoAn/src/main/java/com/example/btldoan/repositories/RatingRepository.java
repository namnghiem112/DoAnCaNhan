package com.example.btldoan.repositories;

import com.example.btldoan.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("Select r From Rating r where r.product.id=:productId")
    List<Rating> getAllProductsRating(@Param("productId") Long productId);

}
