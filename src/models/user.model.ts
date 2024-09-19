export class User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  createdDate?: Date;
  updatedDate?: Date;

  constructor({
    id,
    name,
    email,
    password,
    role,
    isActive,
    createdDate,
    updatedDate,
  }) {
    if (id !== null) this.id = id;
    if (name !== null) this.name = name;
    if (email !== null) this.email = email;
    if (password !== null) this.password = password;
    if (role !== null) this.role = role;
    if (isActive !== null) this.isActive = isActive;
    if (createdDate !== null) this.createdDate = createdDate;
    if (updatedDate !== null) this.updatedDate = updatedDate;
  }
}
