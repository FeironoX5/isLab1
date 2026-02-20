package org.itmo.isLab1.coordinates.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CoordinateCreateDto {
    @NotNull
    private Float x;

    @NotNull
    @Min(-920)
    private Long y;
}
