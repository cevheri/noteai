import { db } from '@/db';
import { account } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const now = new Date();
    
    const sampleAccounts = [
        {
            id: 'account-demo-user-1',
            accountId: 'demo@notesai.com',
            providerId: 'credential',
            userId: 'demo-user-1',
            accessToken: null,
            refreshToken: null,
            idToken: null,
            accessTokenExpiresAt: null,
            refreshTokenExpiresAt: null,
            scope: null,
            password: bcrypt.hashSync('demo123', 10),
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'account-demo-user-2',
            accountId: 'jane@notesai.com',
            providerId: 'credential',
            userId: 'demo-user-2',
            accessToken: null,
            refreshToken: null,
            idToken: null,
            accessTokenExpiresAt: null,
            refreshTokenExpiresAt: null,
            scope: null,
            password: bcrypt.hashSync('demo123', 10),
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'account-demo-user-3',
            accountId: 'alex@notesai.com',
            providerId: 'credential',
            userId: 'demo-user-3',
            accessToken: null,
            refreshToken: null,
            idToken: null,
            accessTokenExpiresAt: null,
            refreshTokenExpiresAt: null,
            scope: null,
            password: bcrypt.hashSync('demo123', 10),
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.insert(account).values(sampleAccounts);
    
    console.log('✅ Account seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});