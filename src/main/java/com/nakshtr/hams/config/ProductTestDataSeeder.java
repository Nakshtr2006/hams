package com.nakshtr.hams.config;

import com.nakshtr.hams.entity.Product;
import com.nakshtr.hams.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Profile("test")
public class ProductTestDataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductTestDataSeeder(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {

        System.out.println(">>> ProductTestDataSeeder is running...");

        createProduct(
                "Laptop",
                "Gaming Laptop",
                new BigDecimal("75000"),
                10
        );

        createProduct(
                "Mouse",
                "Wireless Mouse",
                new BigDecimal("1200"),
                25
        );

        createProduct(
                "Keyboard",
                "Mechanical Keyboard",
                new BigDecimal("3500"),
                15
        );

    }

    private void createProduct(
            String name,
            String description,
            BigDecimal price,
            Integer stock
    ) {

        if (productRepository.findByName(name).isPresent()) {
            return;
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .active(true)
                .build();

        productRepository.save(product);
    }
}