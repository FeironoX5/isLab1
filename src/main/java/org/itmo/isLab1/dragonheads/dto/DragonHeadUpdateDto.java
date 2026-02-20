package org.itmo.isLab1.dragonheads.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class DragonHeadUpdateDto {
    private JsonNullable<Integer> size;

    @NotNull
    private JsonNullable<Float> eyesCount;

    private JsonNullable<Float> toothCount;
}
