// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // from Vercel env
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-5", // you can switch to gpt-4.1 if needed
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({
      reply: response.choices[0].message?.content ?? "No reply",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Chat API failed" });
  }
}
