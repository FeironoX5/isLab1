package org.itmo.isLab1.people;

import org.itmo.isLab1.common.framework.CrudService;
import org.itmo.isLab1.events.EventService;
import org.itmo.isLab1.people.dto.*;
import org.itmo.isLab1.people.mapper.PersonMapper;
import org.itmo.isLab1.people.policy.PersonPolicy;
import org.itmo.isLab1.users.UserService;
import org.springframework.stereotype.Service;

@Service
public class PersonService
    extends CrudService<
        Person,
        PersonRepository,
        PersonMapper,
        PersonPolicy,
        PersonDto,
        PersonCreateDto,
        PersonUpdateDto> {

    public PersonService(
        PersonRepository repository,
        PersonMapper mapper,
        PersonPolicy policy,
        UserService userService,
        EventService<Person> eventService
    ) {
        super(repository, mapper, policy, userService, eventService);
    }
}
