package com.example.btldoan.controllers;


import com.example.btldoan.exception.ProductException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Review;
import com.example.btldoan.models.User;
import com.example.btldoan.request.ReviewRequest;
import com.example.btldoan.services.ReviewService;
import lombok.RequiredArgsConstructor;
import com.example.btldoan.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Review> createReviewHandler(@RequestBody ReviewRequest req, @RequestHeader("Authorization") String jwt)
            throws UserException, ProductException {
        User user=userService.findUserProfileByJwt(jwt);
        Review review=reviewService.createReview(req, user);
        return new ResponseEntity<>(review, HttpStatus.ACCEPTED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductsReviewHandler(@PathVariable Long productId){
        List<Review>reviews=reviewService.getAllReview(productId);
        return new ResponseEntity<>(reviews,HttpStatus.OK);
    }
}
