import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UserDto {
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password?: string;
  roles?: string;
  isActive?: boolean;
  createdDate?: Date;
  updatedDate?: Date;
}
