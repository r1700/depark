import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import DataTable from "../../../../components/table/table";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../app/store";
import { fetchUsers } from "../userThunks";

const columns = [
    { id: "baseuser_id", label: "ID" },
    { id: "fullName", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "department", label: "Department" },
    { id: "employee_id", label: "Employee ID" },
    { id: "google_id", label: "Google ID" },
    { id: "status", label: "Status" },
    { id: "max_cars_allowed_parking", label: "Max Cars Allowed Parking" },
    { id: "created_by", label: "Created By" },
    { id: "approved_by", label: "Approved By" },
    { id: "approved_at", label:"Approved At" },
];

const fields = [
    { name: "fullName", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text" },
    { name: "department", label: "Department", type: "text" },
    // הוסיפי שדות נוספים לפי הצורך
];

const UsersTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const users = useSelector((state: RootState) => state.users.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const rows = users.map((user: any) => ({
        baseuser_id: user.baseuser_id,
        fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
        email: user.email,
        phone: user.phone ?? "-",
        department: user.department ?? "-",
        employee_id: user.employee_id ?? "-",
        google_id: user.google_id ?? "-",
        status: user.status ?? "-",
        max_cars_allowed_parking: user.max_cars_allowed_parking ?? "-",
        created_by: user.created_by ?? "-",
        approved_by: user.approved_by ?? "-",
        approved_at: user.approved_at ? new Date(user.approved_at).toLocaleString() : "-",
    }));

    return (
        <Box sx={{ mt: 4 }}>
            <DataTable
                data={{ columns, rows }}
                title="Users Table"
                showActions={true}
                // fields={fields}
                onRowClick={(row) => {
                    // כאן אפשר לפתוח מודל עריכה או לנווט
                    // לדוג' console.log("Edit user", row);
                }}
                onSubmit={async (data) => {
                    // כאן אפשר לשמור עריכה
                    // לדוג' dispatch(updateUser(data));
                }}
                // onDeleteClick={(row) => {
                //     // כאן אפשר למחוק משתמש
                //     // לדוג' dispatch(deleteUser(row.baseuser_id));
                // }}
            />
        </Box>
    );
};

export default UsersTable;