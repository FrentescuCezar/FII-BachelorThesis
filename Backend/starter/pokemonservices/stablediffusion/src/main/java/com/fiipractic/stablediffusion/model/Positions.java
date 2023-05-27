package com.fiipractic.stablediffusion.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Positions {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name = "username")
    private String username;

    @Column(name="positions", columnDefinition = "text")
    private String positions;

    @Column(name="stickman_image", columnDefinition = "text")
    private String stickmanImage;

    @Column(name="image_custom_image", columnDefinition = "text")
    private String imageCustomImage;

    @Column(name="generated_image", columnDefinition = "text")
    private String generatedImage;

}