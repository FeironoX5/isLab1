package org.itmo.isLab1.dragoncaves.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class DragonCaveUpdateDto {
    @NotNull
    private JsonNullable<Double> depth;
}
