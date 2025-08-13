import { BaseUser } from "../model/database-models/baseUser.model";

const getUserByEmail = async (email: string): Promise<any | null> => {
    try {
        const user = await BaseUser.findOne({
            where: { email },
            raw: true,
        });
        return user ?? null;
    } catch (error) {
        console.error('getUserByEmail error:', error);
        throw error;
    }
};

export { getUserByEmail };