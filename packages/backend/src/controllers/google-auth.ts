import { OAuth2Client } from 'google-auth-library';
import { getRoleById, getUserByEmail } from '../db/operations';
import { Err } from 'joi';

const clientId = process.env.CLIENT_ID;

const client = new OAuth2Client(clientId);

const verifyGoogleToken = async (idToken: string): Promise<string | undefined> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Token payload is missing');
        }

        return payload.email;

    } catch (error: Error|any) {
            throw new Error('Invalid token: ' + error.message);
    }
}

const auth = async (idToken: string): Promise<any> => {
    try {
        const userEmail = await verifyGoogleToken(idToken);
        if (!userEmail) {
            throw new Error('Failed to extract user email from token');
        }

        const user = await getUserByEmail(userEmail);
        if (!user) {
            throw new Error('User not found');
        }

        const role = await getRoleById(user.id);
        if (!role) {
            throw new Error('you dont have permission to access this system');
        }

        return {user, role};

    } catch (error: Error|any) {
        
            throw new Error(error.message);
    }
}

export { auth, verifyGoogleToken };