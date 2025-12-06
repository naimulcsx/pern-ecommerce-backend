import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from './prisma.js';

const app = express();

app.use( express.json() );

app.post('/auth/sign-up', async (req, res) => {
    const userCreateSchema = z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        email: z.email(),
        password: z.string().min(8),
    });
    
    const { success, data, error } = userCreateSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({ message: 'Validation failed', data: z.flattenError(error) });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: passwordHash,
    }

    const createdUser = await prisma.user.create({
        data: user
    });

    res.json({ user: createdUser });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
