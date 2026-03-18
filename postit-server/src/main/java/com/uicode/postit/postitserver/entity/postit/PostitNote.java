package com.uicode.postit.postitserver.entity.postit;

import java.util.Date;
import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import org.hibernate.annotations.ColumnDefault;

import com.uicode.postit.postitserver.entity.AbstractDatedEntity;

@Entity
@Table(name = "postit_note")
@Getter
@Setter
public class PostitNote extends AbstractDatedEntity {

    @Id
    @SequenceGenerator(name = "postit_note_id_seq", sequenceName = "postit_note_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "postit_note_id_seq")
    @Column(name = "id")
    private Long id;

    @Column(name = "version")
    @ColumnDefault("0")
    @Version
    private Long version;

    @Column(name = "name")
    @NotNull
    @Size(min = 1, max = 256)
    private String name;

    @Column(name = "text_value")
    @Size(min = 0, max = 2048)
    private String textValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postit_board_id", nullable = false)
    private Board board;

    @Column(name = "update_text_date")
    private Date updateTextDate;

    @Column(name = "color")
    @Size(min = 0, max = 128)
    private String color;

    @Column(name = "order_num")
    @Min(0)
    @Max(100000)
    private Integer orderNum;

    @OneToOne(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JoinColumn(name = "attached_file_id", referencedColumnName = "id")
    private AttachedFile attachedFile;


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
        if (!(obj instanceof PostitNote))
            return false;
        PostitNote other = (PostitNote) obj;
        return Objects.equals(getId(), other.getId());
    }

}
