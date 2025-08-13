import { NextResponse } from "next/server";
import axios from "axios";
import { getPhi3MiniPrompt } from "@/utils/prompts";
import { getOpenAiPrompt } from "@/utils/prompts";



export async function POST(req: Request) {
  try {
    const { totalMileage, totalCyclingPower } = await req.json();

    const prompt = getPhi3MiniPrompt(totalMileage, totalCyclingPower);

    const ollamaRes = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi3:mini",
        prompt,
        stream: false
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return NextResponse.json({ commentary: ollamaRes.data.response });
  } catch (error: any) {
    console.error("Error calling Ollama:", error.message);
    return NextResponse.json({ error: "Failed to get commentary" }, { status: 500 });
  }
}