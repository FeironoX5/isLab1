package org.itmo.isLab1.specialoperations;

import lombok.RequiredArgsConstructor;
import org.itmo.isLab1.dragons.DragonRepository;
import org.itmo.isLab1.dragons.DragonService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SpecialOperationService {
  private final DragonRepository repository;
  private final DragonService dragonService;

  public Object getDragonsWithAgeLess(long value) {
    return repository.findByAgeLessThan(value);
  }

  public Object getDeepestDragon() {
    return repository.findDragonInDeepestCave().orElse(null);
  }

  public long countDescriptionLess(String value) {
    return repository.countByDescriptionLessThan(value);
  }

  public Map<String, Object> killDragon(int id) {
    boolean deleted = dragonService.delete(id);
    return Map.of("deleted", deleted, "id", id);
  }

  public Object getUniqueColors() {
    return repository.findUniqueColors();
  }
}
