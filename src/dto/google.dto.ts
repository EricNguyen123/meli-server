import { IsEmail, IsString } from 'class-validator';

export class GoogleDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  isActive: boolean;
}
