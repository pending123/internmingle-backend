const prisma = require("../db/prismaClient");
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const getAllForums = async (req, res) => {
  const { sortBy, searchTerm } = req.query;

  const whereConditions = {};
  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { textContent: { contains: searchTerm, mode: "insensitive" } },
    ];
  }
  let orderByCondition = { createdAt: "desc" };

  if (sortBy == "Most Upvotes") {
    orderByCondition = { upvoteCount: "desc" };
  } else if (sortBy == "Least Upvotes") {
    orderByCondition = { upvoteCount: "asc" };
  } else if (sortBy == "Newest") {
    orderByCondition = { createdAt: "desc" };
  } else if (sortBy == "Oldest") {
    orderByCondition = { createdAt: "asc" };
  }

  try {
    const forums = await prisma.forum.findMany({
      where: whereConditions,
      orderBy: orderByCondition,
      select: {
        forumId: true,       
        title: true,         
        textContent: true,   
        createdAt: true,     
        upvoteCount: true,   
        commentCount: true,  
        userId: true,        
        user: {             
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.json(forums);
  } catch (error) {
    console.error("Error fetching forums: ", error);
  }
};

const getForumById = async (req, res) => {
  const { id } = req.params;
  try {
    const forum = await prisma.forum.findUnique({
      where: { forumId: parseInt(id) },
      include: {
        user: {
          select: {
            userId: true,
            clerkId: true,
          },
        },
      },
    });
    res.json(forum);
  } catch (error) {
    console.error("Error Fetching Individual Forum: ", error);
  }
};

const createForum = async (req, res) => {
  const { title, textContent } = req.body;
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    const newForum = await prisma.forum.create({
      data: {
        title,
        textContent,
        userId: user.userId,
      },
    });
    res.json(newForum);
  } catch (error) {
    console.error("Error Creating New Forum: ", error);
  }
};

const updateForum = async (req, res) => {
  const { id } = req.params;
  const { title, textContent } = req.body;
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    const existingForum = await prisma.forum.findUnique({
      where: { forumId: parseInt(id) },
    });

    if (!existingForum) {
      return res.status(404).json({ error: "Forum not found in database" });
    }

    if (existingForum.userId != user.userId) {
      return res.status(403).json({ error: "Unauthorized to edit this forum" });
    }
    const updatedForum = await prisma.forum.update({
      where: { forumId: parseInt(id) },
      data: {
        title,
        textContent,
      },
    });
    res.json(updatedForum);
  } catch (error) {
    console.error("Error updating Forum: ", error);
  }
};

const deleteForum = async (req, res) => {
  const { id } = req.params;
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    const existingForum = await prisma.forum.findUnique({
      where: { forumId: parseInt(id) },
    });

    if (!existingForum) {
      return res.status(404).json({ error: "Forum not found in database" });
    }

    if (existingForum.userId != user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this forum" });
    }
    const deletedForum = await prisma.forum.delete({
      where: { forumId: parseInt(id) },
    });
    res.json(deletedForum);
  } catch (error) {
    console.error("Error deleting Forum: ", error);
  }
};
module.exports = {
  getAllForums,
  getForumById,
  createForum,
  updateForum,
  deleteForum,
};
