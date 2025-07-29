const prisma = require("../db/prismaClient"); // Ensure prismaClient is correctly imported


exports.getAllHobbies = async (req, res) => {
    try {
        // Find all hobbies, selecting both hobbyId and hobby (name)
        const hobbies = await prisma.hobby.findMany({
            select: {
                hobbyId: true, // The ID of the hobby
                hobby: true    // The string name of the hobby
            }
        });
        res.json(hobbies); // Send the list of hobbies as JSON
    } catch (error) {
        console.error("Error fetching hobbies:", error);
        res.status(500).json({ error: "Failed to fetch hobbies." });
    }
};