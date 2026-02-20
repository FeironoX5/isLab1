package org.itmo.isLab1.adminrequests;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.itmo.isLab1.adminrequests.dto.AdminRequestDto;

@RestController
@RequestMapping(value = "/api/admin-requests", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AdminRequestController {

    private final AdminRequestService service;

    @GetMapping
    public ResponseEntity<Page<AdminRequestDto>> index(@PageableDefault(size = 20) Pageable pageable) {
        var adminRequests = service.getAll(pageable);
        return ResponseEntity.ok()
            .header("X-Total-Count", String.valueOf(adminRequests.getTotalElements()))
            .body(adminRequests);
    }

    @GetMapping("/pending")
    public ResponseEntity<Page<AdminRequestDto>> indexPending(@PageableDefault(size = 20) Pageable pageable) {
        var adminRequests = service.getAllPending(pageable);
        return ResponseEntity.ok()
            .header("X-Total-Count", String.valueOf(adminRequests.getTotalElements()))
            .body(adminRequests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminRequestDto> show(@PathVariable int id) {
        var adminRequest = service.getById(id);
        return ResponseEntity.ok(adminRequest);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AdminRequestDto> create() {
        var adminRequest = service.create();
        return ResponseEntity.status(HttpStatus.CREATED).body(adminRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminRequestDto> process(@PathVariable int id, @RequestParam boolean approved) {
        var adminRequest = service.process(id, approved);
        return ResponseEntity.ok(adminRequest);
    }
}
