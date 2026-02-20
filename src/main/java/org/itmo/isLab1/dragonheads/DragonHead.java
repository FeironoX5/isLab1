package org.itmo.isLab1.dragonheads;

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
@Table(name = "dragon_heads")
public class DragonHead extends CrudEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dragon_heads_id_seq")
    @SequenceGenerator(name = "dragon_heads_id_seq", sequenceName = "dragon_heads_id_seq", allocationSize = 1)
    private int id;

    @Column(name = "size")
    private Integer size;

    @NotNull
    @Column(name = "eyes_count", nullable = false)
    private Float eyesCount;

    @Column(name = "tooth_count")
    private Float toothCount;
}
