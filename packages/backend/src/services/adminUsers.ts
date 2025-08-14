import { adminUsers } from "../model/database-models/adminUsers";

const getRoleById = async (id: string): Promise<string | null> => {
    const row = await adminUsers.findOne({
        attributes: ['role'],
        where: { baseuser_id: id },
        raw: true
    });

    return row?.role ?? null;
};

export { getRoleById };