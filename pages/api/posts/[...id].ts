import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		if (!req?.query?.id) {
			return res.status(400).json({ message: 'Record Not Found' });
		}

		const id = parseInt(req.query.id.toString());

		if (isNaN(id)) {
			return res.status(400).json({ message: 'Invalid Parameter' });
		}

		const response = await prisma.post.findUnique({ where: { id } });
		res.json(response);
	}

	return res.status(405).json({ message: 'Method Not Allowed' });
}