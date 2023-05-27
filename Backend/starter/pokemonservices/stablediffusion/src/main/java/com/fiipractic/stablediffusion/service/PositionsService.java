package com.fiipractic.stablediffusion.service;

import com.fiipractic.stablediffusion.model.Positions;
import com.fiipractic.stablediffusion.repository.PositionsRepository;
import com.fiipractic.stablediffusion.requestmodel.positions.PositionsRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;


@Service
public class PositionsService {

    private final PositionsRepository positionsRepository;

    public PositionsService(PositionsRepository positionsRepository) {
        this.positionsRepository = positionsRepository;
    }

    public Positions addPosition(PositionsRequest positionsRequest, String username) throws IOException {

        Positions positions = new Positions();

        positions.setPositions(positionsRequest.getPositions());
        positions.setStickmanImage(positionsRequest.getStickmanImage());
        positions.setImageCustomImage(positionsRequest.getImageCustomImage());

        int atSymbolIndex = username.indexOf('@');
        if (atSymbolIndex >= 0)
            username = username.substring(0, atSymbolIndex);

        positions.setUsername(username);

        return positions;
    }

    public Positions save(Positions positions) {
        return positionsRepository.save(positions);
    }

    public Page<Positions> findAllByUsernameOrderByIdDesc(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        int atSymbolIndex = username.indexOf('@');
        if (atSymbolIndex >= 0)
            username = username.substring(0, atSymbolIndex);

        return positionsRepository.findAllByUsernameOrderByIdDesc(username, pageable);
    }

}
