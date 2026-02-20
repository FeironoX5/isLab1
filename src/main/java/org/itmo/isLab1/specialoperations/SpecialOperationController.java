package org.itmo.isLab1.specialoperations;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/operations", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SpecialOperationController {

  private final SpecialOperationService service;

  @GetMapping("/age/less-than")
  public ResponseEntity<Object> getDragonsWithAgeLess(@RequestParam("value") long value) {
    return ResponseEntity.ok(service.getDragonsWithAgeLess(value));
  }

  @GetMapping("/deepest-dragon")
  public ResponseEntity<Object> getDeepestDragon() {
    return ResponseEntity.ok(service.getDeepestDragon());
  }

  @GetMapping("/description/less-than")
  public ResponseEntity<Long> countDescriptionLess(@RequestParam("value") String value) {
    return ResponseEntity.ok(service.countDescriptionLess(value));
  }

  @DeleteMapping("/kill/{id}")
  public ResponseEntity<Object> killDragon(@PathVariable int id) {
    return ResponseEntity.ok(service.killDragon(id));
  }

  @GetMapping("/unique-colors")
  public ResponseEntity<Object> getUniqueColors() {
    return ResponseEntity.ok(service.getUniqueColors());
  }
}
