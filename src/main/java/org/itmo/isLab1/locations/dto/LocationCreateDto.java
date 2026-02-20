package org.itmo.isLab1.locations.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationCreateDto {
    @NotNull
    private Float x;

    private Integer y;

    @NotNull
    private Float z;

    @NotNull
    private String name;
}
