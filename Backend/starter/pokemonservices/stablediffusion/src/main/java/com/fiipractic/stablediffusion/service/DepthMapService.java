package com.fiipractic.stablediffusion.service;

import com.fiipractic.stablediffusion.model.DepthMap;
import com.fiipractic.stablediffusion.model.Positions;
import com.fiipractic.stablediffusion.repository.DepthMapRepository;
import com.fiipractic.stablediffusion.utils.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class DepthMapService {

    private final DepthMapRepository repository;

    public DepthMapService(DepthMapRepository repository) {
        this.repository = repository;
    }

    public List<DepthMap> findAll() {
        return repository.findAll();
    }

    public Page<DepthMap> findByCategory(Category category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return repository.findByCategory(category,pageable);
    }
}
