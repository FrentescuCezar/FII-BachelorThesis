package com.fiipractic.stablediffusion.requestmodel;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Map;

@Data
public class TextToImageRequest {
    @Column(name="prompt",columnDefinition = "text")
    private String prompt;

    @Column(name="negative_prompt", columnDefinition = "text")
    private String negative_prompts;

    private String sampler_index;

    private Integer steps;
    private Long seed;

    @JsonInclude(JsonInclude.Include.NON_NULL) // Add this line
    @Column(columnDefinition = "json")
    private Map<String, Object> alwayson_scripts; // New field

}
