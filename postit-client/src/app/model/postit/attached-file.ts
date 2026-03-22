import { IdEntity } from '@app/model/id-entity';

export interface AttachedFile extends IdEntity {
  postitNoteId: number;
  filename: string;
  size: number;
  type: string;
}
