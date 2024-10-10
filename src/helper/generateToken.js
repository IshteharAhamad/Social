import jwt from "jsonwebtoken"
const generateToken=  (userId)=> {
    return jwt.sign(
        {userId:userId},
         process.env.SECRET_TOKEN,
         {
        expiresIn:'3d'
    })
}
 export {generateToken};