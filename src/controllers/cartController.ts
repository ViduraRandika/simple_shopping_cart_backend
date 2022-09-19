import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { CartItem } from "../models/CartItem";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { getUserIdFromToken } from "../Utils/tokenData";

export const addItemToOrder = async (req: Request, res: Response) => {
    try {
        const userId = await getUserIdFromToken(req.cookies.token);

        const data = { ...req.body };
        const { id, qty } = data;

        const product = await getProductDetails(id, res);
        if (product) {
            const userRepo = dataSource.getRepository(User);

            const user = await userRepo.findOneBy({ id: userId });

            const openedOrder = await getOpenedOrderDetails(user, res);

            if (openedOrder) {
                const addItemToOrder = await addItem(product, qty, openedOrder, res);

                if (addItemToOrder) {
                    res.send({ msg: "Product added to cart" });
                }
            } else {
                const newOrder: Order = await createNewOrder(user, res);
                
                const addItemToOrder = await addItem(product, qty, newOrder, res);

                if (addItemToOrder) {
                    res.send({ msg: "Product added to cart" });
                }
            }
        } else {
            res.send({ msg: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        return res.send({ error: "Something went wrong" });
    }
}

export const getProductDetails =async (productId:number, res:Response) => {
    try {
        const productRepo = dataSource.getRepository(Product);
        const product : Product = await productRepo.findOneBy({
            id: productId,
            is_archieved: false
        });

        return product ? product : false;
    } catch (error) {
        console.log(error);
        res.send({ error: "Something went wrong" });
    }
}

export const getOpenedOrderDetails =async (user:User, res:Response) => {
    try {
        const orderRepo = dataSource.getRepository(Order);
        const order: Order = await orderRepo.findOneBy({
            user:user,
            status: "opened"
            
        });
        
        return order ? order : false;
    } catch (error) {
        res.send({ error: "Something went wrong" });
    }
}

export const createNewOrder = async (user:User, res:Response) => {
    try {
        let order = new Order();
        order.user = user;
        order.status = "opened";

        await dataSource.manager.save(order);

        return order;
    } catch (error) {
        res.send({ error: "Something went wrong" });
    }
}

export const addItem = async (product:Product, qty:number, order:Order, res:Response) => {
    try {
        const cartItemsRepo = dataSource.getRepository(CartItem);
        
        let cartItem = await cartItemsRepo.findOneBy({
            product: product,
            order: order
        });
        
        if (cartItem !== null) {
            await cartItemsRepo.update(cartItem.id, {
                qty: cartItem.qty + qty
            });

            return true;
        } else {
            let newCartItem = new CartItem();
            newCartItem.order = order;
            newCartItem.product = product;
            newCartItem.qty = qty;

            await dataSource.manager.save(newCartItem);
            return true;
        }
        

    } catch (error) {
        console.log(error);
        res.send({error:"Something went wrong"})
    }
}

export const viewCart = async (req:Request, res:Response) => {
    try {
        const userId = await getUserIdFromToken(req.cookies.token);

        const userRepo = dataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: userId });

        const openedOrder = await getOpenedOrderDetails(user, res);

        if (openedOrder) {
            const cartItemsRepo = dataSource.getRepository(CartItem);
            const cartItems = await cartItemsRepo.findBy({ order: openedOrder });

            res.send({ data: cartItems });
        } else {
            res.send({error:"Something went wrong"})
        }
    } catch (error) {
        console.log(error);
        res.send({error:"Something went wrong"})
    }
}


//not completed
export const updateCart = async (req: Request, res: Response)=>{
    try {
        const data = { ...req.body };
        const { id, qty } = data;

        const userId = await getUserIdFromToken(req.cookies.token);

        const userRepo = dataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: userId });

        const order = await getOpenedOrderDetails(user, res);

        if (order) {
            const cartItems = order.cartItems;

            res.send({data:cartItems})
        } else { 
            res.send({ error: "Something went wrong" });
        }
    } catch (error) {
        console.log(error);
        res.send({error:"Something went wrong"})
    }
}