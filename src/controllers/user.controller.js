import prisma from "../../prisma/index.js";
import { verifyToken } from "../middleware/isLoggedIn.js";
import { cookieToken } from "../utilities/sendCookie.js"; 
import bcrypt from "bcrypt"

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name, email);
    
    // Validate input
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const hashedpassword= await bcrypt.hash(password,10);
    // 
    const exist_user= await prisma.user.findUnique({
       where: {email}
  });
    if(exist_user){
        throw new Error("User existed are required");
    }

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password:hashedpassword  
      }
    });

    // console.log(user);

    // Send cookie token
    cookieToken(user, res);

  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const login= async(req, res) =>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      res.status(500).json({ success: false, message:"Email and password fields are required!" });
    }
    const user=await prisma.user.findUnique({
      where:{
        email
      }
    })
    if(!user){
      res.status(401).json({ success: false, message:"User does not exist!" });
    }
    const ValidatePassword= await bcrypt.compare(password,user.password);
    if(!ValidatePassword){
      res.status(401).json({ success: false, message:"Invalid credentials!" });
    }
    cookieToken(user, res); 
  }
  catch{

  }
}
const logout= async(req,res) =>{
  try {
    res.clearCookie("token");
    res.json({success:true,message:"User logged out successfully"})    
  } catch (error) {
    
  }
}
const profileUpdate=async(req,res)=>{
  try {
    const { name, email } = req.body;
    const userId=req.user.id;
    if(!(email||name)) {
      res.status(400).json({
        success: false,
        message: "Name and email are required"})}
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
      });
      cookieToken(updatedUser,res)
    }   
   catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message
    });
  }
}
const profileDelete=async(req,res) =>{
  try {
    const userId=req.user.id
    // const userId = req.params.id;
    const deleteuser=await prisma.user.delete({
      where:{id:userId}
    });

    await prisma.post.deleteMany({
      where: { id: userId }
    });
    
    return res.clearCookie("token").json({
      success: true,
      message: "Profile deleted successfully",
    })    
  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile delete failed",
      error: error.message
    });
  }
}
const changePassword= async(req,res) =>{
  try {
    const userId=req.user.id;
    const {password,newPassword,confirmPassword}=req.body;
    console.log(userId)
    if(newPassword!==confirmPassword){
      res.status(400).json({ success: false, message:"New password and confirm password should be match!" });
    }
    if(password===newPassword){
      res.status(400).json({ success: false, message:"Current password and change password should not match!" });
    } 
    // const ValidatePassword=await bcrypt.compare(password,user.password);
    const hashNewpassword=await bcrypt.hash(newPassword,10)
    const change_password=await prisma.user.update({
      where:{id:userId},
      data:{
        password:hashNewpassword,
      }
    }) 
    cookieToken(change_password,res);
  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Password update failed",
      error: error.message
    });
  }
}
const users= async(req,res) =>{
  try {
    const query=req.query.name ||req.query.email;

    const users=await prisma.user.findMany({
      where:{
        OR:[{name:{
          contains:query,
          mode:'insensitive'
        }},
        {email:{
          contains:query,
          mode:'insensitive'
        }}]
      },
      select:{
        id: true,
        name: true,
        email: true,
        posts: true,
         _count: true
      }
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No data found!" });
    }
    res.json({success:true,data:users,message:"Data fetched successfully"}) 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
  }



export { signup ,logout ,login,profileUpdate,profileDelete,changePassword,users};
