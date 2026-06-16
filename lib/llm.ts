import OpenAI from 'openai';

// Ensure the OPENAI_API_KEY is available in the environment variables
const openai = new OpenAI();

export async function scoreEmailPriority(subject: string, snippet: string, from: string): Promise<"urgent" | "primary" | "normal"> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an intelligent email sorter. Your job is to classify the priority of an incoming email.
Return ONLY ONE WORD exactly from the following options:
- "urgent": if it contains deadlines, important people, or needs immediate action.
- "primary": for normal, personal, or direct important emails that are not urgent.
- "normal": for newsletters, promotions, automated emails, or bulk messages.

Do not include punctuation, reasoning, or any other words.`
        },
        {
          role: "user",
          content: `From: ${from}\nSubject: ${subject}\nSnippet: ${snippet}`
        }
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    const result = response.choices[0]?.message?.content?.trim().toLowerCase();

    if (result === "urgent" || result === "primary" || result === "normal") {
      return result as "urgent" | "primary" | "normal";
    }

    // Default to primary if LLM acts up
    return "primary";
  } catch (error) {
    console.error("Error scoring email priority:", error);
    return "primary"; // Default fallback
  }
}
