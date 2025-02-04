package com.example.btldoan.services.impl;

import com.example.btldoan.exception.ProductException;
import com.example.btldoan.models.Category;
import com.example.btldoan.models.Product;
import com.example.btldoan.models.Size;
import com.example.btldoan.repositories.CategoryRepository;
import com.example.btldoan.repositories.ProductRepository;
import com.example.btldoan.request.CreateProductRequest;
import com.example.btldoan.request.ProductRequest;
import com.example.btldoan.services.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateProductRequest req) throws ProductException {
        Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
        if(topLevel == null){
            Category topLevelCategory = new Category();
            topLevelCategory.setName(req.getTopLevelCategory());
            topLevelCategory.setLevel(1);
            topLevel = categoryRepository.save(topLevelCategory);
        }

        Category secondLevel=categoryRepository.findByNameAndParant(req.getSecondLevelCategory(),topLevel.getName());
        if(secondLevel==null) {

            Category secondLevelCategory=new Category();
            secondLevelCategory.setName(req.getSecondLevelCategory());
            secondLevelCategory.setParentCategory(topLevel);
            secondLevelCategory.setLevel(2);

            secondLevel= categoryRepository.save(secondLevelCategory);
        }

        Category thirdLevel=categoryRepository.findByNameAndParant(req.getThirdLevelCategory(),secondLevel.getName());
        if(thirdLevel==null) {

            Category thirdLevelCategory=new Category();
            thirdLevelCategory.setName(req.getThirdLevelCategory());
            thirdLevelCategory.setParentCategory(secondLevel);
            thirdLevelCategory.setLevel(3);

            thirdLevel=categoryRepository.save(thirdLevelCategory);
        }
        System.out.println("Image ur: "+req.getImageUrl());
        Product product=new Product();
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setDescription(req.getDescription());
        product.setDiscountedPrice(req.getDiscountedPrice());
        product.setDiscountPersent(req.getDiscountPersent());
        product.setImageUrl(req.getImageUrl());
        product.setBrand(req.getBrand());
        product.setPrice(req.getPrice());
        product.setSizes(req.getSize());
        product.setQuantity(req.getQuantity());
        product.setCategory(thirdLevel);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    @Override
    public String deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product Deleted Successfully";
    }

    @Override
    public Product updateProduct(Long productId, ProductRequest req) throws ProductException {
        Product existingProduct = findProductById(productId);

        // Cập nhật các thuộc tính cơ bản nếu có
        if (req.getTitle() != null && !req.getTitle().isEmpty()) {
            existingProduct.setTitle(req.getTitle());
        }
        if (req.getQuantity() != null) {
            existingProduct.setQuantity(req.getQuantity());
        }
        if (req.getDescription() != null && !req.getDescription().isEmpty()) {
            existingProduct.setDescription(req.getDescription());
        }
        if (req.getPrice() != null) {
            existingProduct.setPrice(req.getPrice());
        }
        if (req.getDiscountPersent() != null) {
            existingProduct.setDiscountPersent(req.getDiscountPersent());
            int discountedPrice = req.getPrice() - (req.getPrice() * req.getDiscountPersent() / 100);
            existingProduct.setDiscountedPrice(discountedPrice);
        }
        if (req.getBrand() != null) {
            existingProduct.setBrand(req.getBrand());
        }
        if (req.getColor() != null) {
            existingProduct.setColor(req.getColor());
        }
        if (req.getImageUrl() != null) {
            existingProduct.setImageUrl(req.getImageUrl());
        }
        if (req.getSizes() != null && !req.getSizes().isEmpty()) {
            Set<Size> updatedSizes = req.getSizes().stream()
                    .map(sizeRequest -> {
                        Size size = new Size();
                        size.setName(sizeRequest.getName());
                        size.setQuantity(sizeRequest.getQuantity());
                        return size;
                    })
                    .collect(Collectors.toSet());
            existingProduct.setSizes(updatedSizes);
        }
        // Xử lý danh mục (Category)
        if (req.getTopLevelCategory() != null && req.getSecondLevelCategory() != null && req.getThirdLevelCategory() != null) {
            Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
            if (topLevel == null) {
                topLevel = new Category();
                topLevel.setName(req.getTopLevelCategory());
                topLevel.setLevel(1);
                topLevel = categoryRepository.save(topLevel);
            }

            Category secondLevel = categoryRepository.findByNameAndParant(req.getSecondLevelCategory(), topLevel.getName());
            if (secondLevel == null) {
                secondLevel = new Category();
                secondLevel.setName(req.getSecondLevelCategory());
                secondLevel.setParentCategory(topLevel);
                secondLevel.setLevel(2);
                secondLevel = categoryRepository.save(secondLevel);
            }

            Category thirdLevel = categoryRepository.findByNameAndParant(req.getThirdLevelCategory(), secondLevel.getName());
            if (thirdLevel == null) {
                thirdLevel = new Category();
                thirdLevel.setName(req.getThirdLevelCategory());
                thirdLevel.setParentCategory(secondLevel);
                thirdLevel.setLevel(3);
                thirdLevel = categoryRepository.save(thirdLevel);
            }

            existingProduct.setCategory(thirdLevel);
        }

        existingProduct.setCreatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }




    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product findProductById(Long id) throws ProductException {
        Optional<Product> opt=productRepository.findById(id);

        if(opt.isPresent()) {
            return opt.get();
        }
        throw new ProductException("product not found with id "+id);
    }

    @Override
    public List<Product> findProductByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProduct(String category, List<String> colors, List<String> sizes, Integer minPrice,
                                       Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        List<Product> products = productRepository.filterProducts(category, minPrice, maxPrice, minDiscount, sort);

        log.info("Product {}", products);
        if (!colors.isEmpty()) {
            products = products.stream()
                    .filter(p -> colors.stream().anyMatch(c -> c.equalsIgnoreCase(p.getColor())))
                    .toList();
        }

        if(stock!=null) {

            if(stock.equals("in_stock")) {
                products=products.stream().filter(p->p.getQuantity()>0).toList();
            }
            else if (stock.equals("out_of_stock")) {
                products=products.stream().filter(p->p.getQuantity()<1).toList();
            }


        }
        int startIndex = (int) pageable.getOffset();
        int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());
        List<Product> pageContent = products.subList(startIndex, endIndex);
        return new PageImpl<>(pageContent, pageable, products.size()); // If color list is empty, do nothing and return all products
    }

    @Override
    public List<Product> recentlyAddedProduct() {
        return productRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
