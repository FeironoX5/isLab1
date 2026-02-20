package org.itmo.isLab1.dragons;

import org.itmo.isLab1.common.framework.CrudRepository;
import org.itmo.isLab1.people.enums.Color;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DragonRepository extends CrudRepository<Dragon> {
    boolean existsByHead_IdAndIdNot(Integer headId, Integer dragonId);

    List<Dragon> findByAgeLessThan(Long value);

    long countByDescriptionLessThan(String value);

    @Query("SELECT DISTINCT d.color FROM Dragon d WHERE d.color IS NOT NULL")
    List<Color> findUniqueColors();

    @Query("""
    SELECT d FROM Dragon d
    JOIN d.cave c
    WHERE c.depth = (SELECT MAX(c2.depth) FROM DragonCave c2)
    ORDER BY d.id
    """)
    List<Dragon> findDragonsInDeepestCave();

    default Optional<Dragon> findDragonInDeepestCave() {
        return findDragonsInDeepestCave().stream().findFirst();
    }
}
