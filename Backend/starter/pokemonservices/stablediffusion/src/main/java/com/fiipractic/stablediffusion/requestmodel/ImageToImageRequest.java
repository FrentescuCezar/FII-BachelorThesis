package com.fiipractic.stablediffusion.requestmodel;

import lombok.Data;

@Data

public class ImageToImageRequest {
    private String image;
    private String prompt;
    private String negative_prompts;
    private Integer steps;
    private Long seed;
}