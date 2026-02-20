package org.itmo.isLab1.people.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.itmo.isLab1.common.framework.dto.CrudDto;
import org.itmo.isLab1.locations.Location;
import org.itmo.isLab1.people.enums.Color;
import org.itmo.isLab1.people.enums.Country;

@Data
@EqualsAndHashCode(callSuper = true)
public class PersonDto extends CrudDto {
    private int id;
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private Location location;
    private Double weight;
    private Country nationality;
}
