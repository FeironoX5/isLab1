package org.itmo.isLab1.people.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.itmo.isLab1.people.enums.Color;
import org.itmo.isLab1.people.enums.Country;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class PersonUpdateDto {
    @NotNull
    @NotBlank
    private JsonNullable<String> name;

    @NotNull
    private JsonNullable<Color> eyeColor;

    @NotNull
    private JsonNullable<Color> hairColor;

    private JsonNullable<Integer> locationId;

    @Positive
    private JsonNullable<Double> weight;

    @NotNull
    private JsonNullable<Country> nationality;
}
