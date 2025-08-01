const prisma = require("../db/prismaClient");

//Creates a new record of the specific user upvoting, stores the userId & forumId, and increments the upvote counter in Forum
//
const upvoteForumPost = async (req, res) => {
  const { forumId } = req.params;
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const [upvoteRecord, updatedForum] = await prisma.$transaction([
      prisma.upvote.create({
        data: {
          forumId: parseInt(forumId),
          userId: user.userId,
        },
      }),
      prisma.forum.update({
        where: { forumId: parseInt(forumId) },
        data: {
          upvoteCount: { increment: 1 },
        },
      }),
    ]);
    res.json({
      upvoteRecord: upvoteRecord,
      newUpvoteCount: updatedForum.upvoteCount,
    });
  } catch (error) {
    console.error("Error creating upvote: ", error);
  }
};

const unUpvoteForumPost = async (req, res) => {
  const { forumId, } = req.params;

  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    const [upvoteRecord, updatedForum] = await prisma.$transaction([
      prisma.upvote.delete({
        where: parseInt(upvoteId),
      }),
      prisma.forum.update({
        where: { 
            forumId: parseInt(forumId),
            userId: user.userId },
        data: {
          upvoteCount: { decrement: 1 },
        },
      }),
    ]);
    res.json({
      upvoteRecord: upvoteRecord,
      newUpvoteCount: updatedForum.upvoteCount,
    });
  } catch (error) {
    console.error("Error removing upvote: ", error);
  }
};

const hasUserUpvoted = async (req, res) => {
  const { forumId } = req.params;

  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const upvoteRecord = await prisma.upvote.findUnique({
       where: {
        userId_forumId: { 
          userId: user.userId,
          forumId: parseInt(forumId),
        },
      },
      select: { upvoteId: true }
    });
    res.json({hasUpvoted: !!upvoteRecord})
  } catch (error) {console.error("Error Finding out if user has upvoted: ", error)}
};

module.exports={
    upvoteForumPost,
    unUpvoteForumPost,
    hasUserUpvoted
}