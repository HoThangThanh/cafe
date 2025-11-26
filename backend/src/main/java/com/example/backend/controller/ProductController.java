package com.example.backend.controller;


import com.example.backend.model.Product;
import com.example.backend.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    // 🟢 Lấy danh sách sản phẩm (mọi người đều xem được)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    // 🔵 Thêm sản phẩm (chỉ ADMIN)
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','ROLE_ADMIN')")
    public Product createProduct(@RequestBody Product p) {
        if (p.getCategory() == null || p.getCategory().isEmpty()) {
            p.setCategory("Khác");
        }
        return productRepo.save(p);
    }

    // 🟡 Cập nhật sản phẩm (chỉ ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','ROLE_ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestBody Product updated
    ) {
        return productRepo.findById(id)
                .map(p -> {
                    p.setName(updated.getName());
                    p.setPrice(updated.getPrice());
                    p.setImage(updated.getImage());
                    p.setCategory(updated.getCategory());
                    Product saved = productRepo.save(p);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔴 Xóa sản phẩm (chỉ ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','ROLE_ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (!productRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
