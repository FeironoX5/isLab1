package org.itmo.isLab1.coordinates.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class CoordinateUpdateDto {
    @NotNull
    private JsonNullable<Float> x;

    @NotNull
    @Min(-920)
    private JsonNullable<Long> y;
}
