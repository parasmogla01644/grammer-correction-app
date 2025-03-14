
import { z } from 'zod';

export const ResponseFormatJSON = z.object({
    word: z.string().describe("The incorrect word or phrase"),
    position: z.number().describe("Character index in the text where the error starts"),
    length: z.number().describe("Length of the error word or phrase"),
    suggestion: z.string().describe("Suggested correction"),
    reason: z.string().describe("Brief explanation of why this is an error"),
    confidence_score: z.number().describe("Confidence score for the error"),
  });
  
export const GrammarResponse = z.object({
    errors: z.array(ResponseFormatJSON).describe("Array of grammar errors found in the text")
});
  