package org.itmo.isLab1.dragoncaves.mapper;

import org.mapstruct.*;
import org.itmo.isLab1.common.framework.mapper.CrudMapper;
import org.itmo.isLab1.common.mapper.*;
import org.itmo.isLab1.dragoncaves.dto.*;
import org.itmo.isLab1.dragoncaves.DragonCave;

@Mapper(
    uses = { JsonNullableMapper.class, ReferenceMapper.class },
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class DragonCaveMapper implements CrudMapper<DragonCave, DragonCaveDto, DragonCaveCreateDto, DragonCaveUpdateDto> {
    public abstract DragonCave map(DragonCaveCreateDto dto);
    public abstract DragonCaveDto map(DragonCave model);
    public abstract DragonCave map(DragonCaveDto model);
    public abstract void update(DragonCaveUpdateDto dto, @MappingTarget DragonCave model);
}
