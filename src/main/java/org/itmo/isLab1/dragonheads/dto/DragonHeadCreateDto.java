package org.itmo.isLab1.dragonheads.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DragonHeadCreateDto {
    private Integer size;

    @NotNull
    private Float eyesCount;

    private Float toothCount;
}
