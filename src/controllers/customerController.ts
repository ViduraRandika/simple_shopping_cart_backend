// import { Request, Response } from "express";
// import { dataSource } from "../data-source";
// import { CartItem } from "../models/CartItem";
// import { Product } from "../models/Product";
// import { User } from "../models/User";

// export const viewProfile = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.token;
//     const userId: number = JSON.parse(
//       Buffer.from(token.split(".")[1], "base64").toString()
//     ).id;

//     const userRepo = dataSource.getRepository(User);

//     const user = await userRepo.findOneBy({ id: userId });

//     res.send({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       secondaryEmail: user.secondaryEmail,
//       address: user.address,
//       phoneNo: user.phoneNo,
//     });
//   } catch (error) {
//     console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const updateProfile = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.token;

//     const userId: number = JSON.parse(
//       Buffer.from(token.split(".")[1], "base64").toString()
//     ).id;

//     const data = { ...req.body };

//     const {
//       firstName,
//       lastName,
//       email,
//       secondaryEmail,
//       phoneNo,
//       address,
//       profilePicImagePath,
//     } = data;

//     const userRepo = dataSource.getRepository(User);

//     await userRepo.update(userId, {
//       ...(firstName && { firstName }),
//       ...(lastName && { lastName }),
//       ...(email && { email }),
//       ...(secondaryEmail && { secondaryEmail }),
//       ...(phoneNo && { phoneNo }),
//       ...(address && { address }),
//       ...(profilePicImagePath && { profilePicImagePath }),
//     });

//     res.send({ message: "Profile updated" });
//   } catch (error) {
//     console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const addItemToCart = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.token;
//     const data = { ...req.body };
//     const { id, qty } = data;

//     const userId: number = JSON.parse(
//       Buffer.from(token.split(".")[1], "base64").toString()
//     ).id;

//     const product = await getProductDetails(id, res);
//     if (product) {
//       const openedCart = await getOpenedCartDetails(userId, res);
//       if (openedCart) {
//         const addItemToCart = await addToCart(product, qty, openedCart, res);
//         if (addItemToCart) {
//           res.send({ msg: "Product added to cart" });
//         }
//       } else {
//         const newCart = await createCart(userId, res);
//         const addItemToCart = await addToCart(product, qty, newCart, res);
//         if (addItemToCart) {
//           res.send({ msg: "Product added to cart" });
//         }
//       }
//     } else {
//       res.send({ error: "Product not found" });
//     }
//   } catch (error) {
//     console.log(error);

//     return res.send({ error: "Something went wrong" });
//   }
// };

// export const getOpenedCartDetails = async (userId: number, res: Response) => {
//   try {
//     const cartRepo = dataSource.getRepository(Cart);
//     const cart: Cart = await cartRepo.findOneBy({
//       customerId: userId,
//       status: "opened",
//     });

//     return cart ? cart : false;
//   } catch (error) {
//     // console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const createCart = async (userId: number, res: Response) => {
//   try {
//     let cart = new Cart();
//     cart.customerId = userId;
//     cart.status = "opened";

//     await dataSource.manager.save(cart);

//     return cart;
//   } catch (error) {
//     // console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const addToCart = async (
//   product: Product,
//   qty: number,
//   cart: Cart,
//   res: Response
// ) => {
//   try {
//     const cartItemsRepo = dataSource.getRepository(CartItem);
//     let cartItem = await cartItemsRepo.findOneBy({
//       product: product,
//       cart: cart,
//     });

//     if (cartItem !== null) {
//       await cartItemsRepo.update(cartItem.id, {
//         qty: cartItem.qty + qty,
//       });
      
//       return true;
//     } else {
//       let newCartItem = new CartItem();
//       newCartItem.productId = product.id;
//       newCartItem.qty = qty;
//       newCartItem.cart = cart;

//       await dataSource.manager.save(newCartItem);
//       return true;
//     }
//   } catch (error) {
//     console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const getProductDetails = async (productId: number, res: Response) => {
//   try {
//     const productRepo = dataSource.getRepository(Product);
//     const product = await productRepo.findOneBy({
//       id: productId,
//       is_archieved: false,
//     });

//     return product ? product : false;
//   } catch (error) {
//     console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const viewCart = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.token;

//     const userId: number = JSON.parse(
//       Buffer.from(token.split(".")[1], "base64").toString()
//     ).id;

//     const cart = await getOpenedCartDetails(userId, res);
//     if (cart) {
//     } else {
//       res.send({ msg: "Cart is empty" });
//     }
//   } catch (error) {
//     console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// };

// export const fetchCartItems = async (cart: Cart, res: Response) => {
//   try {
//     const cartItemsRepo = dataSource.getRepository(CartItem);
//     const cartItems = await cartItemsRepo.findBy({ cart: cart });

//     return cartItems;
//   } catch (error) {
//     console.log(error);

//     res.send({ error: "Something went wrong" });
//   }
// }

// export const viewCartItems = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.token;
//     const userId: number = JSON.parse(
//       Buffer.from(token.split(".")[1], "base64").toString()
//     ).id;

//     const openedCart = await getOpenedCartDetails(userId, res);
//     if (openedCart) {
//       const result = await fetchCartItems(openedCart, res);
//       res.send(result)
//     } else {
//       res.send({ error: "Something went wrong" });
//     }


//   } catch (error) {
//     console.log(error);
//     res.send({ error: "Something went wrong" });
//   }
// };

// // export const updateCart = async (req: Request, res: Response) => {
// //   try {
// //     const data = { ...req.body };
// //     const { id, qty } = data;

// //     const customer = await getCustomerDataByToken(req);
// //     if (customer) {
// //       const order = await getOpenedOrderDetails(customer);
// //       if (order) {
// //         // const cartItems = order.cartItems;
// //         // res.send(cartItems);
// //       } else {
// //         res.status(500).send({ error: "Internal sever error" });
// //       }
// //     } else {
// //       res.status(500).send({ error: "Internal sever error" });
// //     }
// //   } catch (error) {}
// // };

 