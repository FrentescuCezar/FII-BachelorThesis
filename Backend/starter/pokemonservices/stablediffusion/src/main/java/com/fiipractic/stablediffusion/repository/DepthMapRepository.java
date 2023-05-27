package com.fiipractic.stablediffusion.repository;

import com.fiipractic.stablediffusion.model.DepthMap;
import com.fiipractic.stablediffusion.utils.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepthMapRepository extends JpaRepository<DepthMap, Long> {
    List<DepthMap> findByCategory(Category category);
}
