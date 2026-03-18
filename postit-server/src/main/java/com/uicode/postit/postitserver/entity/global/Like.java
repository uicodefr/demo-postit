package com.uicode.postit.postitserver.entity.global;

import java.util.Date;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "global_like")
@Getter
@Setter
public class Like {

    @Id
    @SequenceGenerator(name = "global_like_id_seq", sequenceName = "global_like_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "global_like_id_seq")
    @Column(name = "id")
    private Long id;

    @Column(name = "insert_date")
    @NotNull
    private Date insertDate;

    @Column(name = "client_ip")
    private String clientIp;


    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (!(obj instanceof Like))
            return false;
        Like other = (Like) obj;
        return Objects.equals(getId(), other.getId());
    }

}
