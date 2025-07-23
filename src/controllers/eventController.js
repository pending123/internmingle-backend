const prisma = require("../db/prismaClient");

// //Returns events based on sorting and filtering
// const getEvents = async(req,res) =>{
//     const{category, searchTerm } = req.query
//     const filters ={}

//     if(category){//Need to first add in recent conditional statement
//         filters.category = category
//     }
//     if(searchTerm){
//         filters.searchTerm = searchTerm
//     }
//     try{
//         const events = await prisma.event.findMany({
//             where: filters,
//             orderBy: { dateTime: 'asc' },
//             dateTime: { gte: new Date() }
//         });
//         res.json(events);
//     }catch(error){
//         console.error("Error Fetching events: ", error)
//     }
// }

//Returns events based on sorting and filtering
const getEvents = async(req,res) =>{
    const {category, searchTerm}= req.query
    const limit = 20
    const skip = 20

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
      { address: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const orderDate = { dateTime: "asc" };

  try {
    const events = await prisma.event.findMany({
      where: whereConditions,
      orderBy: orderDate,
      take: limit,
      skip: skip,
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching boards: ", error);
  }
};

//Gets event by ID
const getEventById = async(req,res) =>{
    const {id} = req.params
    try{
        const event = await prisma.event.findUnique({
            where:{eventId: parseInt(id)}
    })
    res.json(event)
    }catch(error){
        console.error("Error fetching event: ", error)
    }
}

//Creates new event
const createEvent = async (req, res) => {
  const { title, category, location, dateTime, description } =
    req.body;
  console.log("Method Called");

    const eventDateTime = new Date(dateTime);
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    console.log("User Profile found");

    const newEvent = await prisma.event.create({
      data: {
        title,
        category,
        location,
        dateTime: eventDateTime,
        description,
        userId: user.userId,
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
