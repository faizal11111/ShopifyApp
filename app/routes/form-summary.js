import { json } from "@remix-run/node";
import { prisma } from "~/db.server";

export const loader = async () => {
    try {
        const responses = await prisma.formResponses.findMany();

        // Summary statistics
        const totalResponses = responses.length;
        const averageRating = responses.reduce((sum, r) => sum + (r.rating || 0), 0) / totalResponses || 0;

        return json({
            success: true,
            data: responses,
            summary: {
                totalResponses,
                averageRating: averageRating.toFixed(2),
            },
        });
    } catch (error) {
        return json({ success: false, error: "Error fetching analytics data" }, { status: 500 });
    }
};
