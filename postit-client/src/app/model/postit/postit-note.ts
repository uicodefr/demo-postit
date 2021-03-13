import { NamedEntity } from '../named-entity';
import { AttachedFile } from './attached-file';

export class PostitNote extends NamedEntity {
  public text: string | undefined;
  public boardId: number | undefined;
  public color: string | undefined;
  public orderNum: number | undefined;
  public attachedFile: AttachedFile | null | undefined;
}
