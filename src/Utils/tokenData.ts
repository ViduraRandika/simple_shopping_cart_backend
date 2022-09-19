import { Request} from "express";

export const getCustomerDataByToken = async (req: Request) => {
    // try {
    //     const token = req.headers.authorization.split(" ")[1];
    //     const customer: Customer = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).other
        
    //     return customer ? customer : false;

        
    // } catch (error) {
    //     return false;
    // }

}

export const getUserIdFromToken =async (token : string) => {
    const userId: number = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
    return userId;
}

