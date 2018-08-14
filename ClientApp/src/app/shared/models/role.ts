import { Permission } from './permission';

export class Role {
  roleID: number;
  roleName: string;
  roleToken: string;
  permissionsRead: Permission [];
  permissionsWrite: Permission [];

  constructor(roleID: number, roleName: string, roleTOken: string) {}
}
