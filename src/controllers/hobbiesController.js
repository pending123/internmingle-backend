const prisma = require("../db/prismaClient"); 

exports.getAllHobbies = async (req, res) => {
    try {
        // Find all hobbies, selecting both hobbyId and hobby (name)
        const hobbies = await prisma.hobby.findMany({
            select: {
                hobbyId: true, 
                hobby: true    
            }
        });
        res.json(hobbies); 
    } catch (error) {
        console.error("Error fetching hobbies:", error);
        res.status(500).json({ error: "Failed to fetch hobbies." });
    }
};