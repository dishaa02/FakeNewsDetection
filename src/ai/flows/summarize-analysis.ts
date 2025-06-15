// SummarizeAnalysis flow to summarize the analysis of an article, highlighting key indicators.
'use server';
/**
 * @fileOverview Summarizes the analysis of an article, highlighting key indicators.
 *
 * - summarizeAnalysis - A function that summarizes the analysis of an article.
 * - SummarizeAnalysisInput - The input type for the summarizeAnalysis function.
 * - SummarizeAnalysisOutput - The return type for the SummarizeAnalysis function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeAnalysisInputSchema = z.object({
  analysis: z
    .string()
    .describe('The detailed analysis of the article, including identified indicators.'),
});
export type SummarizeAnalysisInput = z.infer<typeof SummarizeAnalysisInputSchema>;

const SummarizeAnalysisOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the analysis, highlighting the key indicators that influenced the AI\'s decision.'
    ),
});
export type SummarizeAnalysisOutput = z.infer<typeof SummarizeAnalysisOutputSchema>;

export async function summarizeAnalysis(input: SummarizeAnalysisInput): Promise<SummarizeAnalysisOutput> {
  return summarizeAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAnalysisPrompt',
  input: {
    schema: z.object({
      analysis: z
        .string()
        .describe('The detailed analysis of the article, including identified indicators.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z
        .string()
        .describe(
          'A concise summary of the analysis, highlighting the key indicators that influenced the AI\'s decision.'
        ),
    }),
  },
  prompt: `You are an AI assistant tasked with summarizing a detailed analysis of a news article.  Your summary should highlight the key indicators that influenced the analysis's decision on the article's reliability.

Analysis:
{{{analysis}}}

Summary: `,
});

const summarizeAnalysisFlow = ai.defineFlow<
  typeof SummarizeAnalysisInputSchema,
  typeof SummarizeAnalysisOutputSchema
>(
  {
    name: 'summarizeAnalysisFlow',
    inputSchema: SummarizeAnalysisInputSchema,
    outputSchema: SummarizeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
