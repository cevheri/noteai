import { db } from '@/db';
import { account } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const hashedPassword = bcrypt.hashSync('Admin123!', 10);
    
    const adminAccount = {
        id: 'account-admin-super-user-1',
        accountId: 'admin@notesai.com',
        providerId: 'credential',
        userId: 'admin-super-user-1',
        password: hashedPassword,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert(account).values(adminAccount);
    
    console.log('✅ Admin account seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});