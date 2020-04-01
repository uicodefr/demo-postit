export class User {
  id: number;
  username: string;
  password?: string;
  enabled: boolean;
  roleList: Array<string>;
}
