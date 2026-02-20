package org.itmo.isLab1.dragons.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.itmo.isLab1.people.enums.Color;

@Data
public class DragonCreateDto {
    @NotNull
    @NotBlank
    private String name;

    private java.time.LocalDateTime creationDate;

    @NotNull
    @Positive
    private Long age;

    @NotNull
    private String description;

    @NotNull
    private Boolean speaking;

    private Color color;

    @NotNull
    private Integer coordinatesId;

    @NotNull
    private Integer caveId;

    private Integer killerId;

    private Integer headId;
}
