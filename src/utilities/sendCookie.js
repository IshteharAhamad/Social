import {generateToken} from "../helper/generateToken.js";
const cookieToken= async (user,res) =>{
    const token=generateToken(user.id);
    const options={
        expires:new Date(Date.now()+3*24*60*60*1000),
        httpOnly: true,
    }
    user.password=undefined
    res.cookie("token",token,options).json({
        success:true,
        data:user,
        token,
    })
}
export {cookieToken};