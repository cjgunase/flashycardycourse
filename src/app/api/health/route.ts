import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function GET() {
    const healthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
            database: {
                status: "unknown",
                latency: 0,
                message: "",
            },
            openai: {
                status: "unknown",
                latency: 0,
                message: "",
            },
        },
    };

    // Check Database
    const dbStart = Date.now();
    try {
        await db.execute(sql`SELECT 1`);
        healthStatus.services.database.status = "operational";
        healthStatus.services.database.latency = Date.now() - dbStart;
    } catch (error: any) {
        healthStatus.services.database.status = "down";
        healthStatus.services.database.message = error.message;
        healthStatus.status = "degraded";
    }

    // Check OpenAI
    const openaiStart = Date.now();
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OpenAI API key is not configured");
        }

        const openai = new OpenAI({ apiKey });
        await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 1,
        });

        healthStatus.services.openai.status = "operational";
        healthStatus.services.openai.latency = Date.now() - openaiStart;
    } catch (error: any) {
        healthStatus.services.openai.status = "down";
        healthStatus.services.openai.message = error.message;
        healthStatus.status = "degraded";
    }

    // If both are down, status is down
    if (
        healthStatus.services.database.status === "down" &&
        healthStatus.services.openai.status === "down"
    ) {
        healthStatus.status = "down";
    }

    const statusCode = healthStatus.status === "healthy" ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
}
