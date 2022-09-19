import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  productName: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ type: "double" })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  //no need to validate here
  @Column()
  imagePath: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  warrantyPeriod: number;

  @Column({ type: "double" })
  @IsNotEmpty()
  @IsNumber()
  extendedWarrantyRate: number;

  //no need to validate. Default value - false
  @Column()
  is_archieved: boolean;
}
