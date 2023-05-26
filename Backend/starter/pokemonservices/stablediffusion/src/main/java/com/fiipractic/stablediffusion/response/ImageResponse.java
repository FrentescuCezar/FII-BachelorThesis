package com.fiipractic.stablediffusion.response;

import lombok.Data;

@Data
public class ImageResponse {
    private String image;
    private String seed;

    public ImageResponse(String image, String seed) {
        this.image = image;
        this.seed = seed;
    }
}