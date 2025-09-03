import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // update company
    if (req.method === "PUT") {
        const { id, name,lowStockLevel, address, logo } = req.body;
        // if logo upload it
        if (logo) {
            
        }
        const company = await prisma.company.update({
            where: { id: id },
            data: {
                name: name,
                address,
                lowStockLevel: lowStockLevel,
                logo
            },
        });
        res.status(200).json(company);
    }
    // get company
    else if (req.method === "GET") {
    
        
    }
}