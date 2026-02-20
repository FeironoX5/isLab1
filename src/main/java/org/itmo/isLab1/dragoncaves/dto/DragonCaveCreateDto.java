package org.itmo.isLab1.dragoncaves.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DragonCaveCreateDto {
    @NotNull
    private Double depth;
}
