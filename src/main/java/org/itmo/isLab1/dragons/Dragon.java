package org.itmo.isLab1.dragons;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.itmo.isLab1.common.framework.CrudEntity;
import org.itmo.isLab1.coordinates.Coordinate;
import org.itmo.isLab1.dragoncaves.DragonCave;
import org.itmo.isLab1.dragonheads.DragonHead;
import org.itmo.isLab1.people.Person;
import org.itmo.isLab1.people.enums.Color;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "entity")
@Table(name = "dragons")
public class Dragon extends CrudEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dragons_id_seq")
    @SequenceGenerator(name = "dragons_id_seq", sequenceName = "dragons_id_seq", allocationSize = 1)
    private int id;

    @NotNull
    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "creation_date", nullable = false)
    private java.time.LocalDateTime creationDate;

    @NotNull
    @Positive
    @Column(name = "age", nullable = false)
    private Long age;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "speaking", nullable = false)
    private Boolean speaking;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @ColumnTransformer(write = "?::color")
    @Column(name = "color")
    private Color color;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coordinates_id", nullable = false)
    private Coordinate coordinates;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cave_id", nullable = false)
    private DragonCave cave;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "killer_id")
    private Person killer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "head_id")
    private DragonHead head;

    @PrePersist
    public void prePersist() {
        if (creationDate == null) {
            creationDate = java.time.LocalDateTime.now();
        }
    }
}
