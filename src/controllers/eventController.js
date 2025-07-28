const prisma = require("../db/prismaClient");
const prisma = require("../db/prismaClient");

//Returns events based on sorting and filtering
const getEvents = async (req, res) => {
  const { category, searchTerm } = req.query;
  const limit = 20;
  const skip = 0;

  // List / objects of conditions for filtering
  const whereConditions = {
    dateTime: {
      // Only shows events occurring from the current date/time into the future
      gte: new Date(),
    },
  };
  if (category) {
    if (category.toLowerCase() != "all") {
      whereConditions.category = category;
    }
  }

  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { location: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const orderDate = { dateTime: "asc" };

  try {
    const events = await prisma.event.findMany({
      where: whereConditions,
      orderBy: orderDate,
      take: limit,
      skip: skip,
      distinct: ["eventId"],
      select: {
        eventId: true,
        title: true,
        category: true,
        location: true,
        dateTime: true,
        description: true,
        imgUrl: true,
        userId: true,
        location: true,
        latitude: true,
        longitude: true,
        placeId: true,
        placeName: true,
      },
    });
    console.log(
      "Backend returned events (length, data):",events.length, events
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching boards: ", error);
  }
};

//Gets event by ID
const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { eventId: parseInt(id) },
      include: {
        user: {
          select: {
            userId: true,
            clerkId: true,
          },
        },
      },
    });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event: ", error);
  }
};

//Creates new event
const createEvent = async (req, res) => {
  const {
    title,
    category,
    location,
    dateTime,
    description,
    imgUrl,
    latitude,
    longitude,
    placeId,
    placeName,
  } = req.body;

  const eventDateTime = new Date(dateTime);
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        category,
        location,
        dateTime: eventDateTime,
        description,
        imgUrl,
        userId: user.userId,
        latitude,
        longitude,
        placeId,
        placeName,
      },
    });
    console.log(newEvent);
    res.json(newEvent);
  } catch (error) {
    console.error("Could not create new event: ", error);
  }
};

//Updates an existing event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, category, location, dateTime, description } = req.body;
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    const existingEvent = await prisma.event.findUnique({
      where: { eventId: parseInt(id) },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the current user owns the event
    if (existingEvent.userId !== user.userId) {
      return res.status(403).json({ error: "Unauthorized to edit this event" });
    }
    const updatedEvent = await prisma.event.update({
      where: { eventId: parseInt(id) },
      data: {
        title,
        category,
        location,
        dateTime,
        description,
      },
    });
    res.json(updatedEvent);
  } catch (error) {
    console.error("Could not update event: ", error);
  }
};

//deletes an Event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    const existingEvent = await prisma.event.findUnique({
      where: { eventId: parseInt(id) },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the current user owns the event
    if (existingEvent.userId !== user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this event" });
    }
    const deletedEvent = await prisma.event.delete({
      where: { eventId: parseInt(id) },
    });
    res.json(deletedEvent);
  } catch (error) {
    console.error("Could not delete event: ", error);
  }
};
module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
