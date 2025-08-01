const { messageInRaw } = require('svix');
const prisma = require('../db/prismaClient')
const { clerkClient } = require('@clerk/express')

//helper function for date conversion
const safeDate = (dateString) => dateString && dateString.trim() ? new Date(dateString) : null;


//gets a user's image from Clerk
const userPfpFromClerk = async (clerkUserId) => {
    try {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        return clerkUser.imageUrl || null;
    } catch (error) {
        console.error('Error fetching profile picture from Clerk', error);
        return null;
    }
};

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
        instagram,
        linkedin,
        facebook,
        traitIds, 
        hobbyIds 
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

        //get user's image URL from Clerk UI
        const imageUrl = await userPfpFromClerk(clerkUserId);
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
                        imageUrl: imageUrl,
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

        // Validate required fields --- CHANGE THIS???
        if (!firstName || !lastName || !bio || !university || !schoolMajor || !company || !gender ||
            !workPosition || !workCity) { // took out !internshipStartDate || !internshipEndDate 

            return res.status(400).json({ error: 'Missing required field(s)' });
        }

        // Validate housing preferences if looking for housing
        if (isLookingForHousing && (!sleepSchedule || !numOfRoomates || !noiseLevel)) {
            return res.status(400).json({ error: 'Housing preferences are required when looking for roommates' });
        }


        // Update user profile using userId (primary key)
        const updatedProfile = await prisma.user.update({
            where: { userId: existingUser.userId },
            data: {
                firstName,
                lastName,
                imageUrl: imageUrl,
                birthday: safeDate(birthday),
                bio,
                gender,
                university,
                company,
                workPosition,
                workZipcode: workZipcode || null,
                workCity,
                internshipStartDate: safeDate(internshipStartDate),
                internshipEndDate: safeDate(internshipEndDate),
                schoolMajor,
                isLookingForHousing,
                sleepSchedule: isLookingForHousing ? sleepSchedule : null,
                numOfRoomates: isLookingForHousing ? numOfRoomates : null,
                noiseLevel: isLookingForHousing ? noiseLevel : null,
                profileCompleted: true,
                instagram,
                linkedin,
                facebook, 
            }
        });
        await prisma.userTrait.deleteMany({
            where: { userId: updatedProfile.userId }
        });

        if (traitIds && traitIds.length > 0) {
            const traitConnects = traitIds.map(traitId => ({
                userId: updatedProfile.userId,
                traitId: traitId
            }));
            await prisma.userTrait.createMany({
                data: traitConnects,
                skipDuplicates: true
            });
        }

        await prisma.userHobby.deleteMany({
            where: { userId: updatedProfile.userId }
        });

        if (hobbyIds && hobbyIds.length > 0) {
            const hobbyConnects = hobbyIds.map(hobbyId => ({
                userId: updatedProfile.userId,
                hobbyId: hobbyId
            }));
            await prisma.userHobby.createMany({
                data: hobbyConnects,
                skipDuplicates: true
            });
        }


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
                traits: {
                    include: {
                        trait: true
                    }
                },
                hobbies: {
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
            imageUrl: profile.imageUrl,
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
            traits: profile.traits.map(ut => ut.trait.trait),
            hobbies: profile.hobbies.map(uh => uh.hobby.hobby),
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
        const { userId: clerkUserId } = req.auth();
        const { traits, hobbies, company, housing, page = 1 } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = 20;
        const skip = (pageNumber - 1) * pageSize;

        if (!clerkUserId ) return res.status(401).json({message: 'Unauthorized'})
        const currentUser = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
            select: { userId: true }, 
        });

        
        if (!currentUser) return res.status(401).json({message: 'User not found'});

        const housingBool = housing === 'true' ? true : housing === 'false' ? false : null;

        const traitList = traits?.split(',') ?? [];
        const hobbiesList = hobbies?.split(',') ?? [];

        //Shared filter Condition
        const filters = {
            userId: { not: currentUser.userId },
            profileCompleted: true,
            ...(housingBool !== null && {
                isLookingForHousing: housingBool,
            }),
            ...(company && { 
                company: {
                    contains: company,
                    mode: 'insensitive',
                } 
            }),
            ...(traitList.length > 0 && {
                traits: {
                    some: {
                        trait: {
                            trait: { in: traitList },
                        },
                    },
                },
            }),
            ...(hobbiesList.length > 0 && {
                hobbies: {
                    some: {
                        hobby: {
                            hobby: { in: hobbiesList },
                        },
                    },
                },
            }),
        };

        const [profiles, totalCount] = await Promise.all([
            prisma.user.findMany({
                where: filters,
                include: {
                    traits: { include: { trait: true } },
                    hobbies: { include: { hobby: true } },
                },
                skip,
                take: pageSize,
            }),
            prisma.user.count({ where: filters }),
        ]);

        const filteredProfiles = profiles.filter(profile => {
            const userTraits = profile.traits.map(t =>t.trait.trait);
            const userHobbies = profile.hobbies.map(h => h.hobby.hobby)
            const matchesTraits = traitList.every((trait) => 
                userTraits.includes(trait)
            );
            const matchesHobbies = hobbiesList.every((hobby) => 
                userHobbies.includes(hobby)
            );
            return matchesTraits && matchesHobbies
        })

        const publicProfiles = filteredProfiles.map(profile => ({
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
            traits: profile.traits.map(ut => ut.trait.trait),
            hobbies: profile.hobbies.map(ut => ut.hobby.hobby),
        }));
        
        res.json({
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / pageSize),
            totalResults: totalCount,
            results: publicProfiles,
        });

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
                traits: {
                    include: {
                        trait: true
                    }
                },
                hobbies: {
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
        
        const latestImageUrl = await userPfpFromClerk(clerkUserId);
        if (latestImageUrl !== profile.imageUrl) {
            await prisma.user.update({
                where: { userId: profile.userId },
                data: { imageUrl: latestImageUrl }
            });
            profile.imageUrl = latestImageUrl;
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
        sleepSchedule,
        noiseLevel,
        numOfRoomates,
        instagram,
        linkedin,
        facebook,
        traitIds,
        hobbyIds
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

        const updateData = {}

        const latestImageUrl = await userPfpFromClerk(clerkUserId);
        if (latestImageUrl) {
            updateData.imageUrl = latestImageUrl;
        }

        // Only update fields that are provided
        if (university !== undefined) updateData.university = university;
        if (company !== undefined) updateData.company = company;
        if (schoolMajor !== undefined) updateData.schoolMajor = schoolMajor;
        if (birthday !== undefined) updateData.birthday = safeDate(birthday);
        if (internshipStartDate !== undefined) updateData.internshipStartDate = safeDate(internshipStartDate);
        if (internshipEndDate !== undefined) updateData.internshipEndDate = safeDate(internshipEndDate);
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
                updateData.sleepSchedule = null;
                updateData.noiseLevel = null;
                updateData.numOfRoomates = null;
            }
        }
        
        if (sleepSchedule !== undefined) updateData.sleepSchedule = sleepSchedule;
        if (noiseLevel !== undefined) updateData.noiseLevel = noiseLevel;
        if (numOfRoomates !== undefined) updateData.numOfRoomates = numOfRoomates;

        const updatedProfile = await prisma.user.update({
            where: { userId: existingProfile.userId },
            data: updateData,
            include: {
                traits: {
                    include: {
                        trait: true
                    }
                },
                hobbies: {
                    include: {
                        hobby: true
                    }
                }
            }
        });

        await prisma.userTrait.deleteMany({
            where: { userId: updatedProfile.userId }
        });
        if (traitIds && traitIds.length > 0) {
            const traitConnects = traitIds.map(traitId => ({
                userId: updatedProfile.userId,
                traitId: traitId
            }));
            await prisma.userTrait.createMany({
                data: traitConnects,
                skipDuplicates: true
            });
        }

        await prisma.userHobby.deleteMany({
            where: { userId: updatedProfile.userId }
        });
        if (hobbyIds && hobbyIds.length > 0) {
            const hobbyConnects = hobbyIds.map(hobbyId => ({
                userId: updatedProfile.userId,
                hobbyId: hobbyId
            }));
            await prisma.userHobby.createMany({
                data: hobbyConnects,
                skipDuplicates: true
            });
        }
        
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