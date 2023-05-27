package com.fiipractic.stablediffusion.service;

import com.fiipractic.stablediffusion.model.DepthMap;
import com.fiipractic.stablediffusion.repository.DepthMapRepository;
import com.fiipractic.stablediffusion.utils.Category;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<DepthMap> findByCategory(Category category) {
        return repository.findByCategory(category);
    }
}
