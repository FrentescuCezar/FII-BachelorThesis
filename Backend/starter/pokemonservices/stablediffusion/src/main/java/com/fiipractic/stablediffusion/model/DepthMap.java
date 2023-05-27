package com.fiipractic.stablediffusion.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fiipractic.stablediffusion.utils.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class DepthMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String imageBase64;

    @Enumerated(EnumType.STRING)
    private Category category;

}


