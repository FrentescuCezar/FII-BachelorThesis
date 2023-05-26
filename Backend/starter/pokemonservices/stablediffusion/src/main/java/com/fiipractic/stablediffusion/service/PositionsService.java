package com.fiipractic.stablediffusion.service;

import com.fiipractic.stablediffusion.model.Positions;
import com.fiipractic.stablediffusion.repository.PositionsRepository;
import com.fiipractic.stablediffusion.requestmodel.positions.PositionsRequest;
import org.springframework.stereotype.Service;

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

}
