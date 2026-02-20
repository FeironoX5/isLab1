package org.itmo.isLab1.common.framework;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
      @RequestParam(value = "filter", defaultValue = "") String[] filters) {
    Map<String, String> filterMap = parseFilters(filters);

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
  public ResponseEntity<TDto> create(@Valid @RequestBody TCreateDto request) {
    var obj = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(obj);
  }

  @PatchMapping("/{id}")
  public ResponseEntity<TDto> update(@PathVariable int id, @Valid @RequestBody TUpdateDto request) {
    var obj = service.update(request, id);
    return ResponseEntity.ok(obj);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  private Map<String, String> parseFilters(String[] filters) {
    Map<String, String> filterMap = new HashMap<>();
    if (filters != null) {
      for (String filter : filters) {
        String[] parts = filter.split(":", 2);
        if (parts.length == 2) {
          filterMap.put(parts[0], parts[1]);
        }
      }
    }
    return filterMap;
  }
}
