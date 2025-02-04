package com.example.btldoan.repositories;


import com.example.btldoan.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart,Long> {

    @Query("SELECT c From Cart c where c.user.id=:userId")
    Cart findByUserId(@Param("userId") Long userId);

}