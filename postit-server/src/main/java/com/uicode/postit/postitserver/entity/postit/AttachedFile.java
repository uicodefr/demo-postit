package com.uicode.postit.postitserver.entity.postit;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import com.uicode.postit.postitserver.entity.AbstractDatedEntity;

@Entity
@Table(name = "postit_attached_file")
@Getter
@Setter
public class AttachedFile extends AbstractDatedEntity {

    @Id
    @SequenceGenerator(name = "postit_attached_file_id_seq", sequenceName = "postit_attached_file_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "postit_attached_file_id_seq")
    @Column(name = "id")
    private Long id;

    @Column(name = "filename")
    @NotNull
    @Size(min = 1, max = 128)
    private String filename;

    @Column(name = "size")
    @NotNull
    private Long size;

    @Column(name = "mime_type")
    @NotNull
    @Size(min = 3, max = 256)
    private String type;

    @OneToOne(mappedBy = "file", optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @NotNull
    private AttachedFileData filedata;

    @OneToOne(mappedBy = "attachedFile")
    private PostitNote postitNote;


}
