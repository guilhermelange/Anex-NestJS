import { User as PrismaUser } from 'src/database/prisma';

export class User implements PrismaUser {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  avatar: string;
}
