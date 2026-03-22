import { IdEntity } from '@app/model/id-entity';

export interface User extends IdEntity {
  username: string;
  password?: string;
  enabled: boolean;
  roleList: string[];
}
