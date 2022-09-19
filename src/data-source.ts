import { DataSource } from "typeorm";
import { CartItem } from "./models/CartItem";
import { Order } from "./models/Order";
import { Product } from "./models/Product";
import { User } from "./models/User";

export const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "shopping_cart",
  entities: [User,Product,CartItem,Order],
  logging: false,
  synchronize: true,
});
