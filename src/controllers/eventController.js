const prisma = require ('../db/prismaClient')
import { useAuth, useUser} from "@clerk/clerk-react";

const { isSignedIn, user, isLoaded } = useUser();

const getEvents = async(req,res) =>{
    const {category, searchTerm}= req.query
    const limit = 20
    const skip = 20

    // List / objects of conditions for filtering
    const whereConditions ={
        dateTime: {
            // Only shows events occurring from the current date/time into the future
            gte: new Date(), 
        }
    }
    if (category){
        if (category.toLowerCase()!= 'all'){
            whereConditions.category = category;
        }
    }

    if (searchTerm) {
        whereConditions.OR = [ 
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { location: { contains: searchTerm, mode: 'insensitive' } },
            { address: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    const orderDate = { dateTime: 'asc' };

    try{
        const events = await prisma.event.findMany({
            where:whereConditions,
            orderBy:orderDate,
            take:limit,
            skip:skip
        })
        res.json(events)
    }catch(error){
        console.error("Error fetching boards: ", error)
    }

}

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
const createEvent =async(req, res) =>{
    const{title, category, location, dateTime, description} = req.body

    //Grabing UserId to attach to Event in DB
    const {userId: clerkUserId} =req.auth()
    const user = await prisma.user.findFirst({
        where:{clerkId: clerkUserId} 
    })
    try{
        const newEvent= await prisma.event.create({
            data:{
                title,
                category,
                location,
                dateTime,
                description,
                userId: user.userId 
            }
        })
        res.json(newEvent)
    }catch(error){
        console.error("Could not create new event: ", error)
    }
}

//Updates an existing event
const updateEvent = async(req, res) =>{
    const {id} = req.params
    const{title, category, location, dateTime, description} = req.body
    try{
    const updatedEvent= await prisma.event.update({
        where:{eventId: parseInt(id)},
        data:{
            title,
            category,
            location,
            dateTime,
            description
        }
    })
    res.json(updatedEvent)
    }catch(error){
        console.error("Could not update event: ", error)
    }
}



//deletes an Event
const deleteEvent = async (req, res) =>{
    const{id} = req.params
    try{
        const deletedEvent = await prisma.event.delete({
            where:{eventId: parseInt(id)}
        })
        res.json(deletedEvent)
    }catch(error){
        console.error("Could not delete event: ", error)
    }
}
module.exports={
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}