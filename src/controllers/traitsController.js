const prisma = require("../db/prismaClient");

exports.getAllTraits = async (req, res) => {
    try {
        const traits = await prisma.trait.findMany({
            select: { traitId: true, trait: true } 
        });
        res.json(traits);
    } catch (error) {
        console.error("Error fetching traits:", error);
        res.status(500).json({ error: "Failed to fetch traits." });
    }
};