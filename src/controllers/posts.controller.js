import prisma from "../../prisma/index.js";
const getAllPosts= async (req,res) =>{
    try {
        const page=Number(req.query.page) || 1;
        const limit= Number(req.query.limit) || 10;
        if(page<=0){
            page=1;
        }
        if(limit<=0 || limit>100){
            limit=10;
        }
        const skip=(page-1)*limit;
        const allPost= await prisma.post.findMany({
            skip:skip,
            take:limit,
            include:{
                comments:{
                    select:{
                        id:true,
                        comment:true,
                        comment_count:true,
                        created_at:true,
                        update_at:true,                                         
                        user:{
                            select:{
                                name:true,
                                email:true
                            }
                        }
                    }
                }
            }
        });
        if(!allPost){
            return res.status(404).json({ success: false, message:"No data found!" });  
        } 
        const totalReords= await prisma.post.count();
        const totalPages= Math.ceil( totalReords/limit );
        res.json({success:true,data:allPost,
            meta:{
                Total_Record:totalReords,
                Total_Page:totalPages,
                Currect_Page:page,
                limit:limit,
            }
            ,message:"Data fetched successfully"});      
    } 
    catch (error) {
        res.status(500).json({ success: false, message: error.message }); 
    }
}
const createPost=async(req,res) =>{
    try {
        const authorId=req.user.id;
        const {slug,title,body}=req.body;
        if(!slug || !title ||!body ||!authorId){
            throw new Error("All fields Are required!")
        }
        const create_post= await prisma.post.create({
            data:
            {
                slug,
                title,
                body,
                user:{connect:{id:authorId}}
            }
        })
        res.json({success:true,data:create_post,message:"Post created successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const update_Post= async(req,res) =>{
   try {
    const authorId=req.user.id;
    const postId = req.params.id;
    const {slug,title,body}=req.body;
     if(!slug || !title ||!body){
         res.status(400).json({
         success: false,
         message: "All fields Are required!"})
     }
     const post= await prisma.post.findUnique({
        where:{id:postId}
    })
    if(!post){
       return res.status(404).json({ success: false, message:"Post does not existed" });  
    }
     const updated_post = await prisma.post.update({  
        where:{
            id:postId,
            authorId:authorId,
        },
        data:{
            slug:slug,
            title:title,
            body:body
        }
       });
     res.json({
         success:true,
         data:updated_post,
         message:"Post updated successfully!"
     })
   } catch (error) {
    res.status(500).json({ success: false, message: error.message });
   }
}
const deletePost= async(req,res) =>{
    try {
        const userId=req.user.id;
        const postId=req.params.id;
        console.log(postId)
        /// check post existed or not
        const post= await prisma.post.findUnique({
            where:{id:postId}
        })
        if(!post){
           return res.status(404).json({ success: false, message:"Post does not existed" });  
        }
        const delete_post= await prisma.Post.delete({
            where:{
                id:postId,
                authorId:userId
            }
        })
        res.json({
            success:true,
            data:null,
            message:"Post deleted successfully!"
        })
        
    } 
    catch (error) {
        res.status(500).json({ success: false, message: error.message }); 
    }
}
const getMyAllPost= async (req,res) =>{
    try {
        const userId=req.user.id;
        const getmypost= await prisma.post.findMany({
            where: {
                authorId: userId, 
              },
              include: {
                user: { 
                  select: {
                    name: true,
                    email: true,
                  },
                },
                comments: { 
                  include: {
                    user: {
                      select: {
                        name: true, 
                      },
                    },
                  },
                },
              },
              orderBy: {
                id: 'desc', // Order posts by ID in descending order
              },
            
        })
        res.json({
            success:true,
            data:getmypost,
            message:"Post updated successfully!"
        })
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });  
    }
}
export {createPost,update_Post,deletePost,getMyAllPost,getAllPosts};
