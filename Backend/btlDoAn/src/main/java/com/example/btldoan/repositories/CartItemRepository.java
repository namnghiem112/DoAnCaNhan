package com.example.btldoan.repositories;

import com.example.btldoan.models.Cart;
import com.example.btldoan.models.CartItem;
import com.example.btldoan.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT ci From CartItem ci Where ci.cart=:cart And ci.product=:product And ci.size=:size And ci.userId=:userId")
    CartItem isCartItemExist(@Param("cart") Cart cart, @Param("product") Product product, @Param("size")String size, @Param("userId")Long userId);
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.id = :id")
    void deleteById(Long id);

}
