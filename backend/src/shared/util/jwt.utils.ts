// jwt.util.ts

import jwt, { Secret } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

interface JwtPayload {
    id:ObjectId;
    email:string;
}

export const signToken = (
    payload:JwtPayload,
    secret:Secret,
    expiresIn:string
): string => {
    return jwt.sign(payload,secret,{expiresIn:expiresIn});
};

export const verifyToken = (
    token:string,
    secret:Secret
):JwtPayload | null => {
    try {
        return jwt.verify(token,secret) as JwtPayload;
    } catch (err) {
        console.log('Token verification failed',err);
        return null;
    }
}

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch (err) {
        console.log('Token decoding failed',err);
        return null;
    }
}