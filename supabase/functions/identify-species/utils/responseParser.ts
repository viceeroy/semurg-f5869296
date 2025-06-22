
export function parseOpenAIResponse(content: string): any {
  let jsonContent = content.trim();
  
  // Look for JSON object in the response
  const jsonStart = jsonContent.indexOf('{');
  const jsonEnd = jsonContent.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
  }
  
  return JSON.parse(jsonContent);
}
