package com.example.btldoan.services.impl;

import com.example.btldoan.exception.ProductException;
import com.example.btldoan.models.Product;
import com.example.btldoan.models.Review;
import com.example.btldoan.models.User;
import com.example.btldoan.repositories.ProductRepository;
import com.example.btldoan.repositories.ReviewRepository;
import com.example.btldoan.request.ReviewRequest;
import com.example.btldoan.services.ProductService;
import com.example.btldoan.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;

    @Override
    public Review createReview(ReviewRequest req, User user) throws ProductException {
        Product product=productService.findProductById(req.getProductId());
        Review review=new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReview(req.getReview());
        review.setUsername(user.getFirstName()+" "+user.getLastName());
        review.setCreatedAt(LocalDateTime.now());

        productRepository.save(product);
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getAllReview(Long productId) {
        return reviewRepository.getAllProductsReview(productId);
    }

}
