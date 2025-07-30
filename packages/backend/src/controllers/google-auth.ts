import { OAuth2Client } from 'google-auth-library';
import { getRoleById, getIdByEmail } from '../config/db/operations';

const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

//Check the authentication of the user
const auth = async (idToken: string) => {
    try {
        const userEmail:string|any = await verifyGoogleToken(idToken);
        if(!userEmail) {
            throw new Error('was an error with the token');
        }
        const userId = await getIdByEmail(userEmail);
        if(!userId) {
            throw new Error('User not found');
        }
        const role = await getRoleById(userId);
        if(!role) {
            return false
        }
        return true;
    }
    catch (error:Error | any) {
        throw new Error(error.message);
    }

}

// This function verifies the Google ID token and returns user information
const verifyGoogleToken = async (idToken: string) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        
    return payload?.email;

    } catch (error: any) {
        throw new Error('Invalid token:'+ error.message);
    }
}


export default auth;