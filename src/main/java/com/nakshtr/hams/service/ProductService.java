package com.nakshtr.hams.service;

import com.nakshtr.hams.entity.Product;
import com.nakshtr.hams.repository.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final AuditLogService auditLogService;

    public ProductService(
            ProductRepository productRepository,
            AuditLogService auditLogService
    ) {
        this.productRepository = productRepository;
        this.auditLogService = auditLogService;
    }

    private String getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null) {
            return "UNKNOWN";
        }

        return authentication.getName();
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );
    }

    public Product createProduct(
            Product product
    ) {

        product.setCreatedAt(
                LocalDateTime.now()
        );

        Product savedProduct =
                productRepository.save(product);

        auditLogService.log(
                "Created Product: "
                        + savedProduct.getName(),
                getCurrentUser()
        );

        return savedProduct;
    }

    public Product updateProduct(
            Long id,
            Product updatedProduct
    ) {

        Product existingProduct =
                getProductById(id);

        existingProduct.setName(
                updatedProduct.getName()
        );

        existingProduct.setDescription(
                updatedProduct.getDescription()
        );

        existingProduct.setPrice(
                updatedProduct.getPrice()
        );

        existingProduct.setStock(
                updatedProduct.getStock()
        );

        existingProduct.setActive(
                updatedProduct.isActive()
        );

        Product savedProduct =
                productRepository.save(
                        existingProduct
                );

        auditLogService.log(
                "Updated Product: "
                        + savedProduct.getName(),
                getCurrentUser()
        );

        return savedProduct;
    }

    public void deleteProduct(Long id) {

        Product product =
                getProductById(id);

        auditLogService.log(
                "Deleted Product: "
                        + product.getName(),
                getCurrentUser()
        );

        productRepository.delete(
                product
        );
    }
}