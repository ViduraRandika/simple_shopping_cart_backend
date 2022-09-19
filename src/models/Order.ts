import { IsNotEmpty, IsNumber } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { CartItem } from "./CartItem";
import { User } from "./User";


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double", nullable:true })
  total: number;

  @Column()
  status: string;

  @Column({ type: "date", nullable: true })
  orderPlacedDate: string;

  @ManyToOne(() => User, (user) => user.order)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order)
  cartItems: CartItem[];
}
