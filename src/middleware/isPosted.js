import prisma from "../../prisma/index.js";
const checkPost=async(req,res,next) =>{
    try {
        const userId = req.user.id;
        const { id: postId } = req.params; // Extracting the postId from req.params
        console.log("User ID:", userId);
        console.log("Post ID:", postId);
        if (!postId) {
            return res.status(400).json({
              success: false,
              message: "Post ID is required",
            });
          }
        const post= await prisma.post.findUnique({
            where:{authorId:userId,
           }
        });
        if (!post) {
            return res.status(404).json({
              success: false,
              message: "Post not found or you are not authorized to perform this action.",
            });
          }  
        console.log(post)
        req.post = post;
        next();    
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error. Unable to validate post ownership.",
          });
    }
}
export {checkPost}