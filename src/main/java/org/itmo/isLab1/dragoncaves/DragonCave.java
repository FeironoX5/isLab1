package org.itmo.isLab1.dragoncaves;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.itmo.isLab1.common.framework.CrudEntity;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "entity")
@Table(name = "dragon_caves")
public class DragonCave extends CrudEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dragon_caves_id_seq")
    @SequenceGenerator(name = "dragon_caves_id_seq", sequenceName = "dragon_caves_id_seq", allocationSize = 1)
    private int id;

    @NotNull
    @Column(name = "depth", nullable = false)
    private Double depth;
}
