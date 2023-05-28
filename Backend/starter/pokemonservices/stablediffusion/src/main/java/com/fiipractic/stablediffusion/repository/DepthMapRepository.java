package com.fiipractic.stablediffusion.repository;

import com.fiipractic.stablediffusion.model.DepthMap;
import com.fiipractic.stablediffusion.model.Positions;
import com.fiipractic.stablediffusion.utils.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepthMapRepository extends JpaRepository<DepthMap, Long> {
    Page<DepthMap> findByCategory(Category category, Pageable pageable);

}
