import { User } from '@app/model/global/user';

export function userAnonymousMock(): null {
  return null;
}

export function userAdminMock(): User {
  return {
    id: 1,
    username: 'userAdmin',
    roleList: ['ROLE_ADMIN'],
    enabled: true,
  };
}

export function defaultUserListMock(): User[] {
  return [
    { id: 1, username: 'admin', roleList: ['ROLE_BOARD_WRITE'], enabled: true },
    { id: 2, username: 'superadmin', roleList: ['ROLE_BOARD_WRITE', 'ROLE_USER_WRITE'], enabled: true },
  ] as User[];
}

export function roleListMock(): string[] {
  return ['ROLE_BOARD_WRITE', 'ROLE_USER_WRITE'];
}
