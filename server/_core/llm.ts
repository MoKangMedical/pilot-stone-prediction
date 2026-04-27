// LLM integration - stub for local development
export async function invokeLLM(prompt: string, options?: { maxTokens?: number }): Promise<string> {
  console.log("[LLM] Prompt:", prompt.substring(0, 100) + "...")
  // In production, this calls the actual LLM API
  return "LLM response stub - configure API key for real responses"
}

export async function translateToChinese(text: string): Promise<string> {
  return invokeLLM(`Translate the following to Chinese: ${text}`)
}

export async function generateSummary(text: string): Promise<string> {
  return invokeLLM(`Generate a brief summary: ${text}`)
}
