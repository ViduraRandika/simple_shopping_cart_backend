import { IsNotEmpty, IsNumber } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Order, (order) => order.cartItems)
  order: Order;
}
