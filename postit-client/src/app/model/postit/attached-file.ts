import { IdEntity } from '../id-entity';

export interface AttachedFile extends IdEntity {
  postitNoteId: number;
  filename: string;
  size: number;
  type: number;
}
