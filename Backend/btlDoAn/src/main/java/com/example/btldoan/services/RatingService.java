package com.example.btldoan.services;

import com.example.btldoan.exception.ProductException;
import com.example.btldoan.models.Rating;
import com.example.btldoan.models.User;
import com.example.btldoan.request.RatingRequest;

import java.util.List;

public interface RatingService {
    Rating createRating(RatingRequest req, User user) throws ProductException;

    List<Rating> getProductsRating(Long productId);
}
