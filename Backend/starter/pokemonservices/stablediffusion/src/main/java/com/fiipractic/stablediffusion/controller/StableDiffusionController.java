package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.fiipractic.stablediffusion.requestmodel.positions.PositionsRequest;
import com.fiipractic.stablediffusion.response.ImageResponse;
import com.fiipractic.stablediffusion.requestmodel.ImageToImageRequest;
import com.fiipractic.stablediffusion.requestmodel.TextToImageRequest;

import com.fiipractic.stablediffusion.model.Positions;
import com.fiipractic.stablediffusion.service.PositionsService;
import com.fiipractic.stablediffusion.service.StableDiffusionService;

import com.fiipractic.stablediffusion.utils.ExtractJWT;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api")
@JsonFormat
@CrossOrigin(origins = "http://localhost:3000")
public class StableDiffusionController {

    private final StableDiffusionService stableDiffusionService;
    private final PositionsService positionsService;

    public StableDiffusionController(StableDiffusionService stableDiffusionService, PositionsService positionsService) {
        this.stableDiffusionService = stableDiffusionService;
        this.positionsService = positionsService;
    }

    @PostMapping(value = "/textToImage")
    public ImageResponse TextToImage(@RequestBody TextToImageRequest imageRequest) throws Exception {
        return stableDiffusionService.generateTextToImage(imageRequest);
    }

    @PostMapping(value = "/imageToImage")
    public ImageResponse ImagetoImage(@RequestBody ImageToImageRequest imageRequest) throws Exception {
        return stableDiffusionService.generateImageToImage(imageRequest);
    }

    @PostMapping(value = "/addPosition")
    public ResponseEntity<Positions> AddPosition(@RequestHeader(value = "Authorization") String token, @RequestBody PositionsRequest positionsRequest) throws Exception {
        try {
            String username = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
            Positions positions = positionsService.addPosition(positionsRequest, username);
            positionsService.save(positions);

            return new ResponseEntity<>(positions, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "recent")
    public Page<Positions> getRecentPositions(@RequestHeader(value = "Authorization") String token,
                                              @RequestParam("page") int page,
                                              @RequestParam("size") int size) {
        String username = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        return positionsService.findAllByUsernameOrderByIdDesc(username, page, size);
    }

}