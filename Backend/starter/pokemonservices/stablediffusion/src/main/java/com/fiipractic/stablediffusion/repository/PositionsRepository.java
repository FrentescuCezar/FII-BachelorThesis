package com.fiipractic.stablediffusion.repository;

import com.fiipractic.stablediffusion.model.Positions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
public interface PositionsRepository extends JpaRepository<Positions, Integer> {
    Page<Positions> findAllByUsernameOrderByIdDesc(String username, Pageable pageable);
}
