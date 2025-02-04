package com.example.btldoan.services;


import com.example.btldoan.exception.CartItemException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Cart;
import com.example.btldoan.models.CartItem;
import com.example.btldoan.models.Product;

public interface CartItemService {
     CartItem createCartItem(CartItem cartItem);

     CartItem updateCartItem(Long userId, Long id,int quantity) throws CartItemException, UserException;

     CartItem isCartItemExist(Cart cart, Product product, String size, Long userId);

     void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException;

     CartItem findCartItemById(Long cartItemId) throws CartItemException;
}
