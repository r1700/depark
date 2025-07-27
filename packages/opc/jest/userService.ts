export interface User {
    username: string;
    password: string;
}

export const users: User[] = [];

// פונקציה לרישום משתמש
export const registerUser = async (username: string, password: string): Promise<void> => {
    // כאן הייתם מוסיפים לוגיקה לרישום משתמש
    users.push({ username, password });
};

// פונקציה להתחברות
export const loginUser = async (username: string, password: string): Promise<string | null> => {
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
        return 'token'; // כאן הייתם מחזירים JWT אמיתי
    }
    return null;
};
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';