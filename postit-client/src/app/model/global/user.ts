import { IdEntity } from '../id-entity';

export class User extends IdEntity {
  username: string | undefined;
  password?: string | undefined;
  enabled: boolean | undefined;
  roleList: Array<string> | undefined;
}
