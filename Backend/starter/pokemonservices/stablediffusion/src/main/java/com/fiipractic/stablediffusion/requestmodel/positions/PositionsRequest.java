package com.fiipractic.stablediffusion.requestmodel.positions;

import lombok.Data;

@Data
public class PositionsRequest {
    private String positions;
    private String stickmanImage;
    private String imageCustomImage;
    private String generatedImage;
}
