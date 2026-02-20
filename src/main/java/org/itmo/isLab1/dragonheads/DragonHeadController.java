package org.itmo.isLab1.dragonheads;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.itmo.isLab1.common.framework.CrudController;
import org.itmo.isLab1.dragonheads.dto.*;

@RestController
@RequestMapping(value = "/api/heads", produces = MediaType.APPLICATION_JSON_VALUE)
public class DragonHeadController
    extends CrudController<
        DragonHead,
        DragonHeadDto,
        DragonHeadCreateDto,
        DragonHeadUpdateDto,
        DragonHeadService> {

    public DragonHeadController(
        DragonHeadService service
    ) {
        super(service);
    }
}
