package org.itmo.isLab1.dragoncaves;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.itmo.isLab1.common.framework.CrudController;
import org.itmo.isLab1.dragoncaves.dto.*;

@RestController
@RequestMapping(value = "/api/caves", produces = MediaType.APPLICATION_JSON_VALUE)
public class DragonCaveController
    extends CrudController<
        DragonCave,
        DragonCaveDto,
        DragonCaveCreateDto,
        DragonCaveUpdateDto,
        DragonCaveService> {

    public DragonCaveController(
        DragonCaveService service
    ) {
        super(service);
    }
}