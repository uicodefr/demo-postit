package com.uicode.postit.postitserver.entity.postit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "postit_attached_file_data")
@Getter
@Setter
public class AttachedFileData {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "data", length = 500000)
    @NotNull
    private byte[] data;

    @OneToOne
    @JoinColumn(name = "id")
    @MapsId
    private AttachedFile file;

    public AttachedFileData() {
    }

    public AttachedFileData(byte[] data, AttachedFile file) {
        this.data = data;
        this.file = file;
    }

}
