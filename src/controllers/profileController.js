const prisma = require ('../db/prismaClient')


const createProfile = async (req, res) =>{
    const{
        firstName,
        lastName,
        birthday,
        bio,
        gender,
        university,
        company,
        workPosition,
        workZipcode,
        internshipStartDate,
        internshipEndDate,
        schoolMajor,
        isLookingForHousing,
        sleepSchedule,
        numOfRoomates,
        noiseLevel,
        budgetRange,
        instagram,
        linkedin,
        github,
        facebook
    } = req.body

    try{
        const newProfile = await prisma.profile.create({
            data:{
                firstName,
                lastName,
                birthday,
                bio,
                gender,
                university,
                company,
                workPosition,
                workZipcode,
                internshipStartDate,
                internshipEndDate,
                schoolMajor,
                isLookingForHousing,
                sleepSchedule,
                numOfRoomates,
                noiseLevel,
                budgetRange,
                instagram,
                linkedin,
                github,
                facebook
            }
        })
        res.json(newProfile)
    }catch(error){
        console.error("Could not create new profile: ", error)
    }

}

const getProfileById = async (req, res) =>{
    const{id} = req.params;
    try{
        const event = await prisma.event.findUnique({
            where: {userId: parseInt(id)}
        })
        res.json(event)
    }catch(error){
        console.error("Could not retrieve profile: ", error)
    }
}

const getProfiles = async (req, res) => {

}

const getCurrentUserProfile = async (req, res) => {

}

const deleteCurrentUserProfile = async (req, res) => {

}


module.exports ={
    createProfile,
    getProfileById,
    getProfiles,
    getCurrentUserProfile,
    deleteCurrentUserProfile
}