package org.itmo.isLab1.dragons.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.itmo.isLab1.people.enums.Color;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class DragonUpdateDto {
    @NotNull
    @NotBlank
    private JsonNullable<String> name;

    private JsonNullable<java.time.LocalDateTime> creationDate;

    @NotNull
    @Positive
    private JsonNullable<Long> age;

    @NotNull
    private JsonNullable<String> description;

    @NotNull
    private JsonNullable<Boolean> speaking;

    private JsonNullable<Color> color;

    @NotNull
    private JsonNullable<Integer> coordinatesId;

    @NotNull
    private JsonNullable<Integer> caveId;

    private JsonNullable<Integer> killerId;

    private JsonNullable<Integer> headId;
}
