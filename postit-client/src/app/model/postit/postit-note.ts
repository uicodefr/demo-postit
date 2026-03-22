import { NamedEntity } from '@app/model/named-entity';
import { AttachedFile } from './attached-file';

export interface PostitNote extends NamedEntity {
  text: string;
  boardId: number;
  color: string;
  orderNum: number;
  attachedFile?: AttachedFile | null;
}
