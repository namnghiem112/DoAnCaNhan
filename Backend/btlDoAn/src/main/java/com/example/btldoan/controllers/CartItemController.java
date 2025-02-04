package com.example.btldoan.controllers;

import com.example.btldoan.exception.CartItemException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.CartItem;
import com.example.btldoan.models.User;
import com.example.btldoan.response.ApiResponse;
import com.example.btldoan.services.CartItemService;
import com.example.btldoan.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart_items")
@RequiredArgsConstructor
public class CartItemController {

    private final CartItemService cartItemService;
    private final UserService userService;


    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(@PathVariable Long cartItemId, @RequestHeader("Authorization")String jwt) throws CartItemException, UserException {

        User user=userService.findUserProfileByJwt(jwt);
        cartItemService.removeCartItem(user.getId(), cartItemId);

        ApiResponse res=new ApiResponse("Item Remove From Cart",true);

        return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> payload,
            @RequestHeader("Authorization") String jwt
    ) throws CartItemException, UserException {
        int quantity = payload.get("quantity");
        User user = userService.findUserProfileByJwt(jwt);
        CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, quantity);
        return new ResponseEntity<>(updatedCartItem, HttpStatus.ACCEPTED);
    }

}
