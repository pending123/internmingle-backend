const prisma = require("../db/prismaClient");

// Get message history between two users
exports.getMessageHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query; 
    
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
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { receiverId: parseInt(userId) }
        ]
      },
      include: {
        sender: { select: { userId: true, firstName: true } },
        receiver: { select: { userId: true, firstName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Process to get unique conversations with last message
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === parseInt(userId) 
        ? message.receiverId 
        : message.senderId;
      
      const otherUser = message.senderId === parseInt(userId)
        ? message.receiver
        : message.sender;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          lastMessageTime: message.createdAt
        });
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};