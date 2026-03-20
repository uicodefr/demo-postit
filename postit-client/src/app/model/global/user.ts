import { IdEntity } from '../id-entity';

export interface User extends IdEntity {
  username: string;
  password?: string;
  enabled: boolean;
  roleList: string[];
}
