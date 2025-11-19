import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            {
                status: "error",
                message: "OpenAI API key is not configured",
                apiKeyConfigured: false,
            },
            { status: 500 }
        );
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: "Hello, are you working?" },
            ],
            max_tokens: 10,
        });

        return NextResponse.json({
            status: "success",
            message: "OpenAI API is working correctly",
            apiKeyConfigured: true,
            openaiResponse: response.choices[0].message.content,
        });
    } catch (error: any) {
        console.error("OpenAI Test Error:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Failed to connect to OpenAI",
                apiKeyConfigured: true,
                errorDetails: error.message,
            },
            { status: 500 }
        );
    }
}
