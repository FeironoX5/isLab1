package org.itmo.isLab1.people.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.itmo.isLab1.people.enums.Color;
import org.itmo.isLab1.people.enums.Country;

@Data
public class PersonCreateDto {
    @NotNull
    @NotBlank
    private String name;

    @NotNull
    private Color eyeColor;

    @NotNull
    private Color hairColor;

    private Integer locationId;

    @Positive
    private Double weight;

    @NotNull
    private Country nationality;
}
