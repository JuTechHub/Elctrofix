import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context = `You are an expert electrician AI assistant specializing in home electrical repairs and maintenance. You help customers with electrical problems, repairs, safety advice, and general electrical questions. 

Key guidelines:
- Always prioritize electrical safety above all else
- Recommend turning off power at the circuit breaker for any electrical work
- Suggest professional electrician consultation for complex or dangerous tasks
- Provide clear, step-by-step instructions for safe DIY tasks
- Explain electrical concepts in simple terms
- Ask clarifying questions when needed
- Warn about electrical hazards and code violations
- Be helpful but always emphasize safety

Previous conversation:
${
  conversationHistory
    ?.map((msg: any) => `${msg.role}: ${msg.content}`)
    .join("\n") || ""
}

Customer: ${message}

Please provide helpful, safe, and accurate electrical advice. If the task seems dangerous or requires professional expertise, recommend consulting a licensed electrician:`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI electrician" },
      { status: 500 }
    );
  }
}
