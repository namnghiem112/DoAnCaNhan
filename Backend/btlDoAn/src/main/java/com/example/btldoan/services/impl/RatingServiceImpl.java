package com.example.btldoan.services.impl;

import com.example.btldoan.exception.ProductException;
import com.example.btldoan.models.Product;
import com.example.btldoan.models.Rating;
import com.example.btldoan.models.User;
import com.example.btldoan.repositories.RatingRepository;
import com.example.btldoan.request.RatingRequest;
import com.example.btldoan.services.ProductService;
import com.example.btldoan.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final ProductService productService;

    @Autowired
    public RatingServiceImpl(RatingRepository ratingRepository,ProductService productService) {
        this.ratingRepository=ratingRepository;
        this.productService=productService;
    }

    @Override
    public Rating createRating(RatingRequest req, User user) throws ProductException {

        Product product=productService.findProductById(req.getProductId());

        Rating rating=new Rating();
        rating.setProduct(product);
        rating.setUser(user);
        rating.setRating(req.getRating());
        rating.setUsername(user.getFirstName()+" "+user.getLastName());
        rating.setCreatedAt(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getProductsRating(Long productId) {
        return ratingRepository.getAllProductsRating(productId);
    }
}
