import  jwt  from "jsonwebtoken";
import prisma from "../../prisma/index.js";
const verifyToken=async(req,res,next)=>{
    try {
        const token= req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new Error(401,"unauthenticate user")
        }
        const decodeToken= await jwt.verify(token, process.env.SECRET_TOKEN);
        if(!decodeToken){
            throw new Error("Invalid token")
        }
        const user= await prisma.user.findUnique({
            where:{
                id:decodeToken.userId
            }
        })
        // console.log(user)
        req.user=user
        next()
        
    } catch (error) {
        throw new Error({error:error})
    }
}
export {verifyToken}