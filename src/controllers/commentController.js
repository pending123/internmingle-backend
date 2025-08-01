const prisma = require("../db/prismaClient");

const getAllComments = async (req, res) => {
  const { forumId } = req.params;
  const orderDate = { createdAt: "asc" };
  try {
    const comments = await prisma.comment.findMany({
      where: { forumId: parseInt(forumId) },
      orderBy: orderDate,
      include: {
        user: {
          select: {
            userId: true,
            clerkId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    console.log(
      `[Comments Controller] getAllComments called for forumId: ${forumId}`
    ); // Add this

    res.json(comments);
  } catch (error) {
    console.error("Error Fetching All Comments: ", error);
  }
};

const createComment = async (req, res) => {
  const { textContent } = req.body;
  const { forumId } = req.params;

  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    const [comment, updatedForum] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          textContent,
          userId: user.userId,
          forumId: parseInt(forumId),
        },
        include: {
          user: {
            select: {
              userId: true,
              clerkId: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
      }),
      prisma.forum.update({
        where: { forumId: parseInt(forumId) },
        data: {
          commentCount: { increment: 1 },
        },
      }),
    ]);

    res.json({
      comment: comment,
      newCommentCount: updatedForum.commentCount,
    });
  } catch (error) {
    console.error("Error creating comment", error);
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    const existingComment = await prisma.comment.findFirst({
      where: { commentId: parseInt(commentId) },
    });

    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found in database" });
    }

    if (existingComment.userId != user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment" });
    }
    const [deletedComment, updatedForum] = await prisma.$transaction([
      prisma.comment.delete({
        where: { commentId: parseInt(commentId) },
      }),
      prisma.forum.update({
        where: { forumId: existingComment.forumId },
        data: {
          commentCount: { decrement: 1 },
        },
      }),
    ]);
    res.json({
      deletedComment: deletedComment,
      newCommentCount: updatedForum.commentCount,
    });
  } catch (error) {
    console.error("Error Deleting comment", error);
  }
};

module.exports = {
  getAllComments,
  createComment,
  deleteComment,
};
