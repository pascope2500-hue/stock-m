import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try{
        const { firstName, lastName, email, phone, role, password, confirmPassword,companyId } = req.body;
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(404).json({ message: 'User already exists' });
        }
        if(password !== confirmPassword){
            return res.status(404).json({ message: 'Password does not match' });
        }
        const newPassword = await hashPassword(password);
        // Create new user
        const user = await prisma.user.create({
            data: { firstName, lastName, email, phone, role, password:newPassword, status: 'Active', companyId },
        });
        return res.status(200).json({ message: 'User created successfully', user });
    }catch(err){
        return res.status(404).json({ message: 'Something went wrong' });
    }
    }
}