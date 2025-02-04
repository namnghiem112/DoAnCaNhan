package com.example.btldoan.controllers;

import com.example.btldoan.domain.ProductSize;
import com.example.btldoan.exception.ProductException;
import com.example.btldoan.models.Product;
import com.example.btldoan.request.CreateProductRequest;
import com.example.btldoan.request.ProductRequest;
import com.example.btldoan.response.ApiResponse;
import com.example.btldoan.services.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("api/admin")
@Slf4j
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<Product>> findAllProduct(){
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Product> createProductHandler(@RequestBody CreateProductRequest req) throws ProductException {
        Product createdProduct = productService.createProduct(req);
        return new ResponseEntity<>(createdProduct, HttpStatus.ACCEPTED);
    }
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<ApiResponse> deleteProductHandler(@PathVariable Long productId) throws ProductException{
        String msg=productService.deleteProduct(productId);
        ApiResponse res=new ApiResponse(msg,true);
        return new ResponseEntity<>(res,HttpStatus.ACCEPTED);

    }
    @GetMapping("/recent")
    public ResponseEntity<List<Product>> recentlyAddedProduct(){
        List<Product> products = productService.recentlyAddedProduct();
        return new ResponseEntity<>(products,HttpStatus.OK);
    }
    @PutMapping("/update/{productId}")
    public ResponseEntity<Product> updateProductHandler(@RequestBody ProductRequest req, @PathVariable Long productId) throws ProductException{
        Product updatedProduct=productService.updateProduct(productId, req);
        return new ResponseEntity<>(updatedProduct,HttpStatus.OK);
    }
    @PostMapping("/creates")
    public ResponseEntity<ApiResponse> createMultipleProduct(@RequestBody CreateProductRequest[] req) throws ProductException{
        for(CreateProductRequest product:req) {
            productService.createProduct(product);
        }
        ApiResponse res=new ApiResponse("products created successfully",true);
        return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
    }
}
