// Create a temporary debug file: debug.js in your backend root
const prisma = require('./src/db/prismaClient');

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                userId: true,
                clerkId: true,
                firstName: true,
                lastName: true,
                imageUrl: true  // Check if this field exists
            },
            take: 5
        });
        
        console.log('Database users:', JSON.stringify(users, null, 2));
        
        // Check if imageUrl column exists in schema
        const userColumns = await prisma.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'User' AND column_name = 'imageUrl'
        `;
        console.log('ImageUrl column exists:', userColumns.length > 0);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();