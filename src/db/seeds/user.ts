import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            id: 'demo-user-1',
            name: 'John Demo',
            email: 'demo@notesai.com',
            emailVerified: false,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'demo-user-2',
            name: 'Jane Smith',
            email: 'jane@notesai.com',
            emailVerified: false,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'demo-user-3',
            name: 'Alex Developer',
            email: 'alex@notesai.com',
            emailVerified: false,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ User seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});