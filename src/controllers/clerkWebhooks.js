const prisma = require('../db/prismaClient');
const { Webhook } = require('svix');

const webhookHandler = async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET; //NEED TO ADD TO THE .ENV

        if (!WEBHOOK_SECRET) {
            console.error('Missinkg CLERK SECRET WEBHOOK');
            return res.status(500).json({error: 'webhook configuration error' });
        }

        const headers = req.headers;
        const payload = req.body;

        const wh = new Webhook(WEBHOOK_SECRET);
        let evt;

        try {
                evt = wh.verify(payload, headers);
        } catch (err) {
            console.error('webhook signature verification failed: ', err);
            return res.status(400).json({ error: 'invalid webhook signature '});
        }
        const { type, data } = evt;

        switch (type) {
            case 'user.created':
                await handleUserCreated(data);
                break;
            case 'user.updated':
                await handleUserUpdated(data);
                break;
            case 'user.deleted':
                await handleUserDeleted(data);
                break;
            default:
                console.log(`unhandled webhook type: ${type}`);
        }

        res.status(200).json({received: true});
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Internal server error '});
    }

};

const handleUserCreated = async (userData) => {
    try {
        const {id: clerkId, first_name, last_name, image_url } = userData;

        console.log(`Processing user.created webhook for Clerk ID: ${clerkId}`);
        console.log('Full user data:', userData); // Add this for debugging

        //for webhook testing
        const firstName = first_name || 'user';
        const lastName = last_name || '';
        const imageUrl = image_url || null;

        //creates basic user when signing up
        //profile will be 100% complete after onboarding
        const user = await prisma.user.create({
            data: {
                clerkId: clerkId,
                firstName: firstName,
                lastName: lastName,
                imageUrl: imageUrl,
                bio: '',
                profileCompleted: false
            }
        });
        console.log(`created user record for Clerk Id: ${clerkId}`);
        console.log('Created user:', user); // Add this for debugging
    } catch (error){
        console.error('error creating user:', error);
        throw error;
    }
}

const handleUserUpdated = async (userData) => {
    try{
        const { id: clerkId, first_name, last_name } = userData;

        console.log(`Processing user.updated webhook for Clerk ID: ${clerkId}`);

        const result = await prisma.user.updateMany({
            where: { clerkId: clerkId },
            data: {
                firstName: first_name,
                lastName: last_name,
                imageUrl: imageUrl
            }
        });
        console.log(`updated ${result.count} user records for Clerk Id: ${clerkId}`);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const handleUserDeleted = async (userData) => {
    try {
        const { id: clerkId } = userData;

        console.log(`Processing user.delted for Clerk ID: ${clerkId}`);

        const result = await prisma.user.deleteMany({
            where: { clerkId: clerkId }
        });

        console.log(`deleted ${result.count} user records for Clerk ID: ${clerkId}`);
    } catch (error) {
        console.error('error deleting user:', error);
        throw error;
    }
};

module.exports = {
    webhookHandler
};