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
        // Check if user profile exists already
        let existingUser = await prisma.user.findFirst({
            where: { clerkId: clerkUserId }
        });

        // If no existing user, create one (handles webhook failure edge case)
        if (!existingUser) {
            try {
                // Get user details from Clerk to create basic profile
                const clerkUser = await clerkClient.users.getUser(clerkUserId);
                
                existingUser = await prisma.user.create({
                    data: {
                        clerkId: clerkUserId,
                        firstName: clerkUser.firstName || '',
                        lastName: clerkUser.lastName || '',
                        bio: '',
                        profileCompleted: false
                    }
                });
                console.log(`Created user record for Clerk ID: ${clerkUserId}`);
            } catch (createError) {
                console.error('Error creating user:', createError);
                return res.status(500).json({ error: 'Failed to create user record' });
            }
        }

        // Check if profile is already completed
        if (existingUser.profileCompleted) {
            return res.status(400).json({ error: 'Profile already completed' });
        }

        // Validate required fields
        if (!firstName || !lastName || !bio || !university || !company || !gender ||
            !workPosition || !workCity || !internshipStartDate || !internshipEndDate || !schoolMajor) {
            return res.status(400).json({ error: 'Missing required field(s)' });
        }

        // Validate housing preferences if looking for housing
        if (isLookingForHousing && (!sleepSchedule || !numOfRoomates || !noiseLevel || !budgetRange)) {
            return res.status(400).json({ error: 'Housing preferences are required when looking for roommates' });
        }

        // Update user profile using userId (primary key)
        const updatedProfile = await prisma.user.update({
            where: { userId: existingUser.userId },
            data: {
                firstName,
                lastName,
                birthday: birthday ? new Date(birthday) : null,
                bio,
                gender,
                university,
                company,
                workPosition,
                workZipcode: workZipcode || null,
                workCity,
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
            }
        });

        res.status(201).json(updatedProfile);
    } catch (error) {
        console.error("Could not create/update profile: ", error);
        res.status(500).json({ error: 'Failed to complete profile' });
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
            return res.status(404).json({ error: 'Could not find profile' });
        }
        
        if (!profile.profileCompleted) {
            return res.status(404).json({ error: 'Profile not completed' });
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
            traits: profile.userTraits.map(ut => ut.trait.trait),
            hobbies: profile.userHobbies.map(uh => uh.hobby.hobby),
            events: profile.events
        };
        
        res.json(publicProfile);
    } catch (error) {
        console.error("Could not retrieve profile: ", error);
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};

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
            traits: profile.userTraits.map(ut => ut.trait.trait),
            hobbies: profile.userHobbies.map(ut => ut.hobby.hobby),
        }));
        
        res.json(publicProfiles);
    } catch (error) {
        console.error('Could not retrieve profiles:', error);
        res.status(500).json({ error: 'Failed to retrieve profiles' });
    }
};

const getCurrentUserProfile = async (req, res) => {
    const { userId: clerkUserId } = req.auth();

    if (!clerkUserId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const profile = await prisma.user.findFirst({
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
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};

const updateCurrentUserProfile = async (req, res) => {
    const { userId: clerkUserId } = req.auth();
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
        numOfRoomates,
        instagram,
        linkedin,
        facebook
    } = req.body;

    if (!clerkUserId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const existingProfile = await prisma.user.findFirst({
            where: { clerkId: clerkUserId }
        });

        if (!existingProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const updateData = {};

        // Only update fields that are provided
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
                // Clear housing preferences if not looking for housing
                updateData.budgetRange = null;
                updateData.sleepSchedule = null;
                updateData.noiseLevel = null;
                updateData.numOfRoomates = null;
            }
        }
        
        if (budgetRange !== undefined) updateData.budgetRange = budgetRange;
        if (sleepSchedule !== undefined) updateData.sleepSchedule = sleepSchedule;
        if (noiseLevel !== undefined) updateData.noiseLevel = noiseLevel;
        if (numOfRoomates !== undefined) updateData.numOfRoomates = numOfRoomates;

        const updatedProfile = await prisma.user.update({
            where: { userId: existingProfile.userId },
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
        console.error('Could not update profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

const deleteCurrentUserProfile = async (req, res) => {
    const { userId: clerkUserId } = req.auth();

    if (!clerkUserId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // First find the user by clerkId
        const existingProfile = await prisma.user.findFirst({
            where: { clerkId: clerkUserId }
        });

        if (!existingProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Delete using userId (primary key)
        const deletedProfile = await prisma.user.delete({
            where: { userId: existingProfile.userId }
        });

        // Delete from Clerk as well
        await clerkClient.users.deleteUser(clerkUserId);

        console.log('Profile deleted: ', deletedProfile.userId);
        res.status(204).end();
    } catch (error) {
        console.error('Could not delete profile: ', error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
};

module.exports = {
    createProfile,
    getProfileById,
    getProfiles,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteCurrentUserProfile,
};