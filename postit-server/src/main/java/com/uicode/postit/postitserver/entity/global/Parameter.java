package com.uicode.postit.postitserver.entity.global;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "global_parameter")
@Getter
@Setter
public class Parameter {

    @Id
    @Column(name = "param_name")
    private String name;

    @Column(name = "param_value")
    @NotNull
    private String value;

    @Column(name = "client_view")
    @NotNull
    private Boolean clientView;


    @Override
    public int hashCode() {
        return Objects.hash(getName());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (!(obj instanceof Parameter))
            return false;
        Parameter other = (Parameter) obj;
        return Objects.equals(getName(), other.getName());
    }

}
