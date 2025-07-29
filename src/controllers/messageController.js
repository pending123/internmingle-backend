const prisma = require("../db/prismaClient");

// Get message history between two users
exports.getMessageHistory = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();

    if (!clerkUserId ) return res.status(401).json({message: 'Unauthorized'})
    const currentUser = await prisma.user.findUnique({
          where: { clerkId: clerkUserId },
          select: { userId: true }, 
    });

    const userId1 = currentUser.userId;

    const { userId2 } = req.query; 
    
    if (!userId1 || !userId2) {
      return res.status(400).json({
        success: false,
        message: 'Both user IDs are required'
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(userId1),
            receiverId: parseInt(userId2)
          },
          {
            senderId: parseInt(userId2),
            receiverId: parseInt(userId1)
          }
        ]
      },
      include: {
        sender: {
          select: {
            userId: true,
            firstName: true,
          }
        },
        receiver: {
          select: {
            userId: true,
            firstName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message history'
    });
  }
};

//Send message from one user to another
exports.sendMessage = async (req, res) => {
    try {
        const { content, senderId, receiverId } = req.body;

        // Validate required fields
        if (!content || !senderId || !receiverId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Create message in database
        const newMessage = await prisma.message.create({
        data: {
            content,
            senderId: parseInt(senderId),
            receiverId: parseInt(receiverId)
        },
        include: {
            sender: { select: { userId: true, firstName: true } },
            receiver: { select: { userId: true, firstName: true } }
        }
        });

        // Broadcast via Socket.IO to both users
        req.io.to(`user_${senderId}`).emit('newMessage', newMessage);
        req.io.to(`user_${receiverId}`).emit('newMessage', newMessage);

        // Return success response
        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

//Get a list of people a user has chatted with
exports.getConversationPartners = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();

    if (!clerkUserId ) return res.status(401).json({message: 'Unauthorized'})
    const currentUser = await prisma.user.findUnique({
          where: { clerkId: clerkUserId },
          select: { userId: true }, 
    });

    const userId = currentUser.userId;
    
    // Get all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { receiverId: parseInt(userId) }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { userId: true, firstName: true, lastName: true} },
        receiver: { select: { userId: true, firstName: true, lastName: true } },
      },
    });

    // Process to get unique conversations with last message
    const conversations = new Map();

    for (const msg of messages) {
      const isSender = msg.sender.userId == userId;
      const partner = isSender ? msg.receiver : msg.sender;
      const partnerId = partner.userId;

      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner, 
          lastMessage: msg, 
          unreadCount: 0
        });
      }

      if (!isSender && msg.read === false) {
        conversations.get(partnerId).unreadCount += 1
      }
    }

    const conversationPartners = Array.from(conversations.values());

    res.status(200).json(conversationPartners);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};