package org.itmo.isLab1.users;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.ZonedDateTime;

import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.CreationTimestamp;
import org.itmo.isLab1.common.entity.BaseEntity;
import org.itmo.isLab1.utils.datetime.ZonedDateTimeConverter;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_seq")
    @SequenceGenerator(name = "users_id_seq", sequenceName = "users_id_seq", allocationSize = 1)
    private int id;

    @NotBlank
    @Column(name="username", nullable=false, unique=true)
    private String username;

    @Enumerated(EnumType.STRING)
    @ColumnTransformer(write="?::user_role")
    @Column(name="role", nullable=false)
    private Role role;

    @JsonIgnore
    @ToString.Exclude
    @Column(name="password_hash", nullable=false)
    private String password;

    @CreationTimestamp
    @Column(name="created_at", nullable=false)
    @Convert(converter = ZonedDateTimeConverter.class)
    private ZonedDateTime createdAt;

    @JsonIgnore
    public boolean isAdmin() {
        return this.role.equals(Role.ROLE_ADMIN);
    }
}
