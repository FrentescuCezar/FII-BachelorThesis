package com.fiipractic.stablediffusion.response;

import lombok.Data;

import java.util.List;

@Data
public class ImageResponse {
    private List<String> images;
    private String seed;

    public ImageResponse(List<String> images, String seed) {
        this.images = images;
        this.seed = seed;
    }
}