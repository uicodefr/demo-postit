import { IdEntity } from '../id-entity';

export class AttachedFile extends IdEntity {
  public postitNoteId: number | undefined;
  public filename: string | undefined;
  public size: number | undefined;
  public type: number | undefined;
}
