import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Work',
            color: '#3b82f6',
            icon: 'briefcase',
            userId: 'demo-user-1',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Personal',
            color: '#10b981',
            icon: 'user',
            userId: 'demo-user-1',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Ideas',
            color: '#8b5cf6',
            icon: 'lightbulb',
            userId: 'demo-user-1',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Projects',
            color: '#f59e0b',
            icon: 'folder',
            userId: 'demo-user-2',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Learning',
            color: '#06b6d4',
            icon: 'book',
            userId: 'demo-user-2',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Code Snippets',
            color: '#ef4444',
            icon: 'code',
            userId: 'demo-user-3',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Documentation',
            color: '#6b7280',
            icon: 'file-text',
            userId: 'demo-user-3',
            createdAt: new Date().toISOString(),
        },
    ];

    const insertedCategories = await db.insert(categories).values(sampleCategories).returning();
    
    console.log('✅ Categories seeder completed successfully');
    console.log(`   Inserted ${insertedCategories.length} categories`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});