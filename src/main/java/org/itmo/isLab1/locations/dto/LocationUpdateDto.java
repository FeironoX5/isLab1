package org.itmo.isLab1.locations.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class LocationUpdateDto {
    @NotNull
    private JsonNullable<Float> x;

    private JsonNullable<Integer> y;

    @NotNull
    private JsonNullable<Float> z;

    @NotNull
    private JsonNullable<String> name;
}
