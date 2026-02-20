package org.itmo.isLab1.coordinates.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.itmo.isLab1.common.framework.dto.CrudDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class CoordinateDto extends CrudDto {
  private int id;
  private Float x;
  private Long y;
}
