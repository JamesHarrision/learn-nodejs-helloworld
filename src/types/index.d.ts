// Source - https://stackoverflow.com/a
// Posted by David, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-10, License - CC BY-SA 4.0

import { User as UserPrisma, Role } from "@prisma/client";

type UserRole = User & Role;

declare global {
  namespace Express {
    interface User extends UserPrisma {
      role?: Role
    }
  }
}
