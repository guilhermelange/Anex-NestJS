import { User } from 'src/database/prisma';

export class UserPrisma implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  avatar: string;
}

export class UserDTO {
  constructor(user: UserPrisma) {
    this.user = user;
  }

  user: UserPrisma;
}
