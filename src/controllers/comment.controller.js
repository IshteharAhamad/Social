import prisma from "../../prisma/index.js";
const getComments = async (req, res) => {
  try {
    const Comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email:true
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.json({
      success: true,
      data: Comments,
      message: "Comments fetched successfully!",
    });
  } catch {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createComment = async (req, res) => {
  try {
    const { postId, usercomment } = req.body;
    const userId = req.params.id;
    const addcomment = await prisma.comment.upsert({
      where: { id: postId },
      update: {
        comment_count: { increment: 1 },
      },
      create: {
          comment: usercomment,
          comment_count:1,
        post: {
          connect: { id: postId }, // Connect to the existing Post
        },
        user: {
          connect: { id: userId }, // Connect to the existing User
        },
      },
    });
    const fullComment = await prisma.comment.findUnique({
      where: { id: addcomment.id },
      include: {
        user: { select: { name: true, email: true } }, // Include user fields
        post: { select: { title: true } }, // Include post fields if needed
      },
    });
    res.json({
      success: true,
      data: fullComment,
      message: "Comment added successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const showComment= async (req,res)=>{
    try {
        const id=req.query.id;
        const show_comment= await prisma.comment.findFirst({
            where:{id:id},
            include:{
                user:{
                    select:{
                        name:true
                    }
                }
            }
        });
        res.json({
            success: true,
            data: show_comment,
            message: "Comment fetched successfully!",
          });        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });  
    }
}
const updateComment= async (req,res) =>{
    try {
       const {usercomment} =req.body;
       const {commentId}=req.params;
       const userId=req.query.userId;
       
       const updatedComments = await prisma.comment.updateMany({
        where: {
          AND: [
            { id: commentId },  // Match the comment ID
            { authorId: userId }  // Match the author's ID
          ],
        },
        data: {
          comment: usercomment  // Update the comment field with the new content
        },
      });
    
      // If no comment was updated, return an appropriate message
      if (updatedComments.count === 0) {
        return res.status(404).json({ message: "No comment found or user is not the author" });
      }
    
      // Fetch the updated comment with user details
      const fullComment = await prisma.comment.findFirst({
        where: {
          id: commentId,
          authorId: userId
        },
        include: {
          user: {
            select: {
              name: true  // Include the user's name
            }
          }
        }
      });
       res.json({
        success: true,
        data: fullComment,
        message: "Comment updated successfully!",
      });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message }); 
    }
}
const deleteComment = async (req, res) =>{
    try {
        const {commentId}=req.params;
        if (!commentId) {
            return res.status(400).json({ message: 'Comment ID is missing or invalid.' });
          }
          const check= await prisma.comment.findFirst({
            where:{id:commentId}
          });
          if (!check) {
            return res.status(404).json({ message: 'Data not found.' });
          }
        const [countUpdate, deletedComment] = await prisma.$transaction([
            prisma.comment.update({
              where: { id: commentId },
              data: {
                comment_count: {
                  decrement: 1,  // Decrement the comment count
                },
              },
            }),
            prisma.comment.delete({
              where: { id: commentId },  // Delete the comment
            }),
          ]);

        res.json({
            success: true,
            data: null,
            message: "Comment deleted successfully!",
          });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message }); 
    }
}
export { getComments, createComment,showComment,updateComment,deleteComment};





// const addcomment=await prisma.comment.create({
//     data:{
//         postId:postId,
//         authorId:userId,
//         comment
//     }
// })

// const addcount= await prisma.comment.update({
//     where:{id:postId},
//     data:{
//         comment_count:{
//             increment:1
//         }
//     }
// });
