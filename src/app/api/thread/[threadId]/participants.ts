import { NextApiRequest, NextApiResponse } from 'next';

// Simulated database function (replace with your actual database logic)
async function fetchParticipantsFromDatabase(threadId: string): Promise<{ name: string }[]> {
    // Placeholder logic: Dynamic participants based on threadId
    const dynamicParticipants = [
        { name: `User_${threadId}_1` }, // e.g., "User_1_1" for threadId = "1"
        { name: `User_${threadId}_2` }, // e.g., "User_1_2" for threadId = "1"
    ];
    return dynamicParticipants;

    // Example with Prisma (uncomment and adjust if using Prisma)
    /*
    import { PrismaClient } from '@prisma/client';
    const prisma = new PrismaClient();
    try {
        const thread = await prisma.thread.findUnique({
            where: { id: parseInt(threadId) },
            include: { participants: true },
        });
        await prisma.$disconnect();
        return thread ? thread.participants.map(p => ({ name: p.name })) : [];
    } catch (error) {
        await prisma.$disconnect();
        throw error;
    }
    */
}

// Define a response type for better type safety
interface ApiResponse {
    participants?: { name: string }[];
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Explicitly type threadId as string (or string | undefined if optional)
        const { threadId } = req.query as { threadId?: string };

        if (!threadId) {
            return res.status(400).json({ error: 'threadId is required' });
        }

        // Fetch participants dynamically from the database
        const participants = await fetchParticipantsFromDatabase(threadId);
        return res.status(200).json({ participants });
    } catch (error) {
        console.error('Error fetching participants:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}