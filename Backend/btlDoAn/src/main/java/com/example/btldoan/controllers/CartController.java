package com.example.btldoan.controllers;


import com.example.btldoan.exception.CartItemException;
import com.example.btldoan.exception.ProductException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Cart;
import com.example.btldoan.models.CartItem;
import com.example.btldoan.models.User;
import com.example.btldoan.request.AddItemRequest;
import com.example.btldoan.services.CartService;
import com.example.btldoan.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping("/")
    public ResponseEntity<Cart> findUserCartHandler(@RequestHeader("Authorization") String jwt) throws UserException {
        User user=userService.findUserProfileByJwt(jwt);
        Cart cart=cartService.findUserCart(user.getId());
        if(cart==null){
            cartService.createCart(user);
            return new ResponseEntity<>(cartService.findUserCart(user.getId()), HttpStatus.OK);
        }
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddItemRequest req,
                                                  @RequestHeader("Authorization") String jwt) throws UserException, ProductException, CartItemException {
        User user=userService.findUserProfileByJwt(jwt);
        CartItem item = cartService.addCartItem(user.getId(), req);
        return new ResponseEntity<>(item,HttpStatus.ACCEPTED);
    }
}
