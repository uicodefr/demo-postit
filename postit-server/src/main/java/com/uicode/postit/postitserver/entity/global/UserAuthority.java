package com.uicode.postit.postitserver.entity.global;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "global_user_authority")
public class UserAuthority implements GrantedAuthority {

    private static final long serialVersionUID = 1255821598416411870L;

    @Id
    @SequenceGenerator(name = "global_user_authority_id_seq", sequenceName = "global_user_authority_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "global_user_authority_id_seq")
    @Column(name = "id")
    private Long id;

    @Column(name = "authority")
    @NotNull
    @Size(min = 1, max = 256)
    private String authority;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

}
