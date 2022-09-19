import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IsEqualTo } from "../Utils/passwordValidate.decorator";
import { Order } from "./Order";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: false, select:false })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
  })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsEqualTo("password")
  confirmPassword: string;

  //no need to validate. Default value = false
  @Column({ nullable: false })
  is_admin: boolean;

  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  secondaryEmail: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsPhoneNumber("LK")
  phoneNo: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  address: string;

  @Column({ nullable: true })
  profilePicImagePath: string;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];
}
