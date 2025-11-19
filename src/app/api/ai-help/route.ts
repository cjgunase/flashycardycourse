import { db } from "@/db";
import { cardsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "OpenAI API key is not configured" },
            { status: 500 }
        );
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });
    try {
        const { question, answer, cardId } = await request.json();

        if (!question || !answer || !cardId) {
            return NextResponse.json(
                { error: "Question, answer, and cardId are required" },
                { status: 400 }
            );
        }

        const prompt = `
      You are a helpful tutor. A student is struggling with a flashcard question.

    Question: "${question}"
      Correct Answer: "${answer}"
      
      Please provide a helpful hint or a step-by-step guide to help the student arrive at the answer. 
      Do NOT give the answer directly. 
      Be encouraging and concise.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful tutor." },
                { role: "user", content: prompt },
            ],
        });

        const aiResponse = response.choices[0].message.content;

        // Save to database
        await db
            .update(cardsTable)
            .set({ aiHelp: aiResponse })
            .where(eq(cardsTable.id, cardId));

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error("Error in AI Help API:", error);
        return NextResponse.json(
            { error: "Failed to generate AI help" },
            { status: 500 }
        );
    }
}
