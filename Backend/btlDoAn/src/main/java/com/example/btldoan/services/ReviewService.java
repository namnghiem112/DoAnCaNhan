package com.example.btldoan.services;

import com.example.btldoan.exception.ProductException;
import com.example.btldoan.models.Review;
import com.example.btldoan.models.User;
import com.example.btldoan.request.ReviewRequest;

import java.util.List;

public interface ReviewService {
    Review createReview(ReviewRequest req, User user) throws ProductException;

    List<Review> getAllReview(Long productId);
}
