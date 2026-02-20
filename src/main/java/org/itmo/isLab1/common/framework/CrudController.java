package org.itmo.isLab1.common.framework;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import org.itmo.isLab1.common.framework.dto.CrudDto;

@AllArgsConstructor
public abstract class CrudController<
  T extends CrudEntity,
  TDto extends CrudDto,
  TCreateDto,
  TUpdateDto,
  TService extends CrudService<T, ?, ?, ?, TDto, TCreateDto, TUpdateDto>
  > {
  private TService service;

  @GetMapping
  public ResponseEntity<Page<TDto>> index(
      @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
      @RequestParam(value = "search") String search) {
    Map<String, String> filterMap = parseSearch(search);

    var objs = service.getAll(pageable, filterMap);
    
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(objs.getTotalElements()))
      .body(objs);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TDto> show(@PathVariable int id) {
    var obj = service.getById(id);
    return ResponseEntity.ok(obj);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  public ResponseEntity<TDto> create(@Valid @RequestBody TCreateDto request) {
    var obj = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(obj);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  public ResponseEntity<TDto> update(@PathVariable int id, @Valid @RequestBody TUpdateDto request) {
    var obj = service.update(request, id);
    return ResponseEntity.ok(obj);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  private Map<String, String> parseSearch(String search) {
    Map<String, String> filterMap = new HashMap<>();
    if (search == null || search.isBlank()) {
      return filterMap;
    }

    String[] conditions = search.split(",");
    for (String condition : conditions) {
      String[] parts = condition.split(":", 2);
      if (parts.length == 2) {
        filterMap.put(parts[0].trim(), parts[1].trim());
      } else {
        filterMap.put("name", condition.trim());
      }
    }
    return filterMap;
  }
}
