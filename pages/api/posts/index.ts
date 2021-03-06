import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const data = JSON.parse(req.body);
		const response = await prisma.post.create({ data });
		return res.json(response);
	}

	if (req.method === 'PATCH') {
		const data: { id: number, data: Prisma.PostUpdateInput } = JSON.parse(req.body);
		const response = await prisma.post.update({
			where: { id: data.id },
			data: data.data
		});
		return res.json(response);
	}

	if (req.method === 'DELETE') {
		const data: { id: number } = JSON.parse(req.body);
		const response = await prisma.post.delete({ where: { id: data.id } });
		return res.json(response);
	}

	return res.status(405).json({ message: 'Method Not Allowed' });
}