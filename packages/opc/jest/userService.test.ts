import { registerUser, loginUser, users } from './userService';

describe('User Service', () => {
    beforeEach(() => {
        // ניקוי המערך לפני כל בדיקה
        users.length = 0;
    });

    test('should register a user', async () => {
        await registerUser('testUser', 'password123');
        expect(users).toHaveLength(1);
        expect(users[0].username).toBe('testUser');
    });

    test('should login a user with valid credentials', async () => {
        await registerUser('testUser', 'password123');
        const token = await loginUser('testUser', 'password123');
        expect(token).toBe('token');
    });

    test('should not login a user with invalid credentials', async () => {
        await registerUser('testUser', 'password123');
        const token = await loginUser('testUser', 'wrongPassword');
        expect(token).toBeNull();
    });
});
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';