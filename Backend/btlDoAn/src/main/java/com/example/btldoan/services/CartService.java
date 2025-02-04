package com.example.btldoan.services;


import com.example.btldoan.exception.CartItemException;
import com.example.btldoan.exception.ProductException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Cart;
import com.example.btldoan.models.CartItem;
import com.example.btldoan.models.User;
import com.example.btldoan.request.AddItemRequest;

public interface CartService {

     Cart createCart(User user);

     CartItem addCartItem(Long userId, AddItemRequest req) throws ProductException, CartItemException, UserException;

     Cart findUserCart(Long userId);

}

