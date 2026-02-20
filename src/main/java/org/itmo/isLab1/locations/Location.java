package org.itmo.isLab1.locations;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.itmo.isLab1.common.framework.CrudEntity;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "entity")
@Table(name = "locations")
public class Location extends CrudEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "locations_id_seq")
    @SequenceGenerator(name = "locations_id_seq", sequenceName = "locations_id_seq", allocationSize = 1)
    private int id;

    @NotNull
    @Column(name = "x", nullable = false)
    private Float x;

    @Column(name = "y")
    private Integer y;

    @NotNull
    @Column(name = "z", nullable = false)
    private Float z;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;
}
