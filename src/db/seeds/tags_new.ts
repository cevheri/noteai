import { db } from '@/db';
import { tags } from '@/db/schema';

async function main() {
    const sampleTags = [
        {
            name: 'important',
            color: '#ef4444',
            userId: 'demo-user-1',
        },
        {
            name: 'todo',
            color: '#eab308',
            userId: 'demo-user-1',
        },
        {
            name: 'completed',
            color: '#10b981',
            userId: 'demo-user-1',
        },
        {
            name: 'work',
            color: '#3b82f6',
            userId: 'demo-user-1',
        },
        {
            name: 'urgent',
            color: '#ef4444',
            userId: 'demo-user-2',
        },
        {
            name: 'review',
            color: '#f59e0b',
            userId: 'demo-user-2',
        },
        {
            name: 'done',
            color: '#10b981',
            userId: 'demo-user-2',
        },
        {
            name: 'javascript',
            color: '#eab308',
            userId: 'demo-user-3',
        },
        {
            name: 'python',
            color: '#3b82f6',
            userId: 'demo-user-3',
        },
        {
            name: 'react',
            color: '#06b6d4',
            userId: 'demo-user-3',
        },
        {
            name: 'api',
            color: '#8b5cf6',
            userId: 'demo-user-3',
        },
    ];

    await db.insert(tags).values(sampleTags).returning();
    
    console.log('✅ Tags seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});