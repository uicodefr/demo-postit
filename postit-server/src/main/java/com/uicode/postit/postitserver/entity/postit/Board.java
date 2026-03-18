package com.uicode.postit.postitserver.entity.postit;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import com.uicode.postit.postitserver.entity.AbstractDatedEntity;

@Entity
@Table(name = "postit_board")
@Getter
@Setter
public class Board extends AbstractDatedEntity {

    @Id
    @SequenceGenerator(name = "postit_board_id_seq", sequenceName = "postit_board_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "postit_board_id_seq")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    @NotNull
    @Size(min = 1, max = 128)
    private String name;

    @Column(name = "order_num")
    @Min(0)
    @Max(1000)
    private Integer orderNum;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "board")
    @OrderBy("orderNum ASC")
    private List<PostitNote> noteList;


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
        if (!(obj instanceof Board))
            return false;
        Board other = (Board) obj;
        return Objects.equals(getId(), other.getId());
    }

}
