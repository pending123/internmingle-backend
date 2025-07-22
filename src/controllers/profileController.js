const prisma = require('../db/prismaClient')
const { clerkClient } = require('@clerk/express')

//create user profile-- onboarding
const createProfile = async (req, res) => {
    const {
        firstName,
        lastName,
        birthday,
        bio,
        gender,
        university,
        company,
        workPosition,
        workCity,
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
        facebook
    } = req.body;

    const { userId: clerkUserId } = req.auth();

    if (!clerkUserId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check if user profile exists already and profile is completed already
        const existingUser = await prisma.user.findUnique({
            where: { clerkId: clerkUserId }
        });

        if (!existingUser) {
            return res.status(400).json({ error: 'user not found' });
        }

        if (existingUser.profileCompleted) {
            return res.status(400).json({ error: 'profile already completed' });
        }

        // Makes sure required fields are entered
        if (!firstName || !lastName || !bio || !university || !company || !gender ||
            !workPosition || !workZipcode || !workCity || !internshipStartDate || !internshipEndDate || !schoolMajor) {
            return res.status(400).json({ error: 'Missing required field(s)' });
        }

        if (isLookingForHousing && (!sleepSchedule || !numOfRoomates || !noiseLevel || !budgetRange)) {
            return res.status(400).json({ error: 'Housing preferences are required when looking for roommates' });
        }

        // Update user profile
        const updatedProfile = await prisma.user.update({
            where: { clerkId: clerkUserId },
            data: {
                firstName,
                lastName,
                birthday: birthday ? new Date(birthday) : null,
                bio,
                gender,
                university,
                company,
                workPosition,
                workZipcode,
                internshipStartDate: new Date(internshipStartDate),
                internshipEndDate: new Date(internshipEndDate),
                schoolMajor,
                isLookingForHousing,
                sleepSchedule: isLookingForHousing ? sleepSchedule : null,
                numOfRoomates: isLookingForHousing ? numOfRoomates : null,
                noiseLevel: isLookingForHousing ? noiseLevel : null,
                budgetRange: isLookingForHousing ? budgetRange : null,
                profileCompleted: true,
                instagram,
                linkedin,
                facebook
                //TRAITS AND HOBBIES GO HERE IF NEEDED
            }
        });

        res.status(201).json(updatedProfile);
    } catch (error) {
        console.error("Could not create new profile: ", error);
        res.status(500).json({ error: 'failed to complete profile' });
    }
};

const getProfileById = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await prisma.user.findUnique({
            where: { userId: parseInt(id) },
            include: {
                userTraits: {
                    include: {
                        trait: true
                    }
                },
                userHobbies: {
                    include: {
                        hobby: true
                    }
                },
                events: {
                    orderBy: { dateTime: 'asc' },
                    take: 3
                }
            }
        });

        if (!profile) {
            return res.status(404).json({ error: 'could not find profile' });
        }
        if (!profile.profileCompleted) {
            return res.status(404).json({ error: 'profile not completed' });
        }

        const publicProfile = {
            userId: profile.userId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            birthday: profile.birthday,
            bio: profile.bio,
            gender: profile.gender,
            university: profile.university,
            company: profile.company,
            workPosition: profile.workPosition,
            workCity: profile.workCity,
            internshipStartDate: profile.internshipStartDate,
            internshipEndDate: profile.internshipEndDate,
            schoolMajor: profile.schoolMajor,
            isLookingForHousing: profile.isLookingForHousing,
            sleepSchedule: profile.isLookingForHousing ? profile.sleepSchedule : null,
            numOfRoomates: profile.isLookingForHousing ? profile.numOfRoomates : null,
            noiseLevel: profile.isLookingForHousing ? profile.noiseLevel : null,
            budgetRange: profile.isLookingForHousing ? profile.budgetRange : null,
            traits: profile.userTraits.map(ut => ut.trait),
            hobbies: profile.userHobbies.map(uh => uh.hobby),
            events: profile.events
        };
        res.json(publicProfile);
    } catch (error) {
        console.error("Could not retrieve profile: ", error)
        res.status(500).json({ error: 'failed to retrieve profile' });
    }
}

const getProfiles = async (req, res) => {
    try {
        const profiles = await prisma.user.findMany({
            where: {
                profileCompleted: true
            },
            include: {
                userTraits: {
                    include: {
                        trait: true
                    }
                },
                userHobbies: {
                    include: {
                        hobby: true
                    }
                }
            },
        });

        const publicProfiles = profiles.map(profile => ({
            userId: profile.userId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            bio: profile.bio,
            gender: profile.gender,
            university: profile.university,
            company: profile.company,
            workPosition: profile.workPosition,
            workCity: profile.workCity,
            schoolMajor: profile.schoolMajor,
            isLookingForHousing: profile.isLookingForHousing,
            traits: profile.userTraits.map(ut => ut.trait),
            hobbies: profile.userHobbies.map(uh => uh.hobby)
        }));
        res.json(publicProfiles);
    } catch (error) {
        console.error('could not retrieve profiles:', error);
        res.status(500).json({ error: 'failed to retrieve profiles' });
    }
};

const getCurrentUserProfile = async (req, res) => {
    const { userId: clerkUserId } = req.auth;

    if (!clerkUserId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const profile = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
            include: {
                userTraits: {
                    include: {
                        trait: true
                    }
                },
                userHobbies: {
                    include: {
                        hobby: true
                    }
                },
                events: {
                    orderBy: { dateTime: 'asc' },
                    take: 5
                }
            }
        });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Could not retrieve profile: ', error);
        res.status(500).json({ error: 'failed to retrieve profile' });
    }
};

const updateCurrentUserProfile = async (req, res) => {
    const { userId: clerkUserId } = req.auth;
    const {
        university,
        company,
        schoolMajor,
        birthday,
        internshipStartDate,
        internshipEndDate,
        workCity,
        workZipcode,
        workPosition,
        bio,
        gender,
        isLookingForHousing,
        budgetRange,
        sleepSchedule,
        noiseLevel,
        instagram,
        linkedin,
        facebook
    } = req.body;

    if (!clerkUserId) {
        return res.status(401).json({ error: 'user not authenticated' });
    }

    try {
        const existingProfile = await prisma.user.findUnique({
            where: { clerkId: clerkUserId }
        });

        if (!existingProfile) {
            return res.status(404).json({ error: 'profile not found' });
        }

        const updateData = {};

        // Makes sure user fills out actual info
        if (university !== undefined) updateData.university = university;
        if (company !== undefined) updateData.company = company;
        if (schoolMajor !== undefined) updateData.schoolMajor = schoolMajor;
        if (birthday !== undefined) updateData.birthday = birthday ? new Date(birthday) : null;
        if (internshipStartDate !== undefined) updateData.internshipStartDate = new Date(internshipStartDate);
        if (internshipEndDate !== undefined) updateData.internshipEndDate = new Date(internshipEndDate);
        if (workCity !== undefined) updateData.workCity = workCity;
        if (workZipcode !== undefined) updateData.workZipcode = workZipcode;
        if (workPosition !== undefined) updateData.workPosition = workPosition;
        if (bio !== undefined) updateData.bio = bio;
        if (gender !== undefined) updateData.gender = gender;
        if (instagram !== undefined) updateData.instagram = instagram;
        if (linkedin !== undefined) updateData.linkedin = linkedin;
        if (facebook !== undefined) updateData.facebook = facebook;
        
        if (isLookingForHousing !== undefined) {
            updateData.isLookingForHousing = isLookingForHousing;
            if (!isLookingForHousing) {
                updateData.budgetRange = null;
                updateData.sleepSchedule = null;
                updateData.noiseLevel = null;
                updateData.numOfRoomates = null;
            }
        }
        if (budgetRange !== undefined) updateData.budgetRange = budgetRange;
        if (sleepSchedule !== undefined) updateData.sleepSchedule = sleepSchedule;
        if (noiseLevel !== undefined) updateData.noiseLevel = noiseLevel;

        const updatedProfile = await prisma.user.update({
            where: { clerkId: clerkUserId },
            data: updateData,
            include: {
                userTraits: {
                    include: {
                        trait: true
                    }
                },
                userHobbies: {
                    include: {
                        hobby: true
                    }
                }
            }
        });
        res.json(updatedProfile);
    } catch (error) {
        console.error('could not update profile:', error);
        res.status(500).json({ error: 'failed to update profile' });
    }
}

const deleteCurrentUserProfile = async (req, res) => {
    const { userId: clerkUserId } = req.auth;

    if (!clerkUserId) {
        return res.status(401).json({ error: 'user not authenticated' });
    }

    try {
        const deletedProfile = await prisma.user.delete({
            where: { clerkId: clerkUserId }
        });

        await clerkClient.users.deleteUser(clerkUserId);

        console.log('Profile deleted: ', deletedProfile.userId);
        res.status(204).end()
    } catch (error) {
        console.error('could not delete profile: ', error);
        res.status(500).json({ error: 'failed to delete profile' });
    }
}

module.exports = {
    createProfile,
    getProfileById,
    getProfiles,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteCurrentUserProfile,
}

