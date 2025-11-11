export function generatePrompt(videoTranscript: string) {
  return `
You are a YouTube video summarization system that generates output in JSON format.
The final result MUST be valid JSON with a single field named "content",
which contains text in **Markdown** format as shown below.

The Markdown format within the "content" field must follow this structure:

# Video Summary
Opening paragraph (1–3 paragraphs) that explains the main content of the video.

## Key Points
- (Use bullet points for important points)
- (3–6 points)

## Conclusion
Closing paragraph that summarizes the core message of the video.

Use natural, clear, and professional English.
Do not add any text outside of JSON. Ensure the output is valid JSON.

Video Transcript:
${videoTranscript}
`;
}
