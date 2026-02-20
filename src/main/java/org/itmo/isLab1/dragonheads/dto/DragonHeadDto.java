package org.itmo.isLab1.dragonheads.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.itmo.isLab1.common.framework.dto.CrudDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class DragonHeadDto extends CrudDto {
    private int id;
    private Integer size;
    private Float eyesCount;
    private Float toothCount;
}
