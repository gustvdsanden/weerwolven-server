import { Role } from '../models/role.model';
import { db } from '../models';
const Role = db.Role;

export function getAllRoles(req: any, res: any) {
  Role.find({}).then((roles: Role[]) => {
    res.send(roles);
  });
}
