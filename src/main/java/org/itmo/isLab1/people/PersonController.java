package org.itmo.isLab1.people;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.itmo.isLab1.common.framework.CrudController;
import org.itmo.isLab1.people.dto.*;

@RestController
@RequestMapping(value = "/api/persons", produces = MediaType.APPLICATION_JSON_VALUE)
public class PersonController
    extends CrudController<
        Person,
        PersonDto,
        PersonCreateDto,
        PersonUpdateDto,
        PersonService> {

    public PersonController(
        PersonService service
    ) {
        super(service);
    }
}
