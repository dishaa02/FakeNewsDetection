'use server';

/**
 * @fileOverview Analyzes the credibility of a news article.
 *
 * - analyzeArticle - A function that analyzes the credibility of a news article.
 * - AnalyzeArticleInput - The input type for the analyzeArticle function.
 * - AnalyzeArticleOutput - The return type for the AnalyzeArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeArticleInputSchema = z.object({
  articleText: z.string().describe('The text of the news article to analyze.'),
});
export type AnalyzeArticleInput = z.infer<typeof AnalyzeArticleInputSchema>;

const AnalyzeArticleOutputSchema = z.object({
  isCredible: z.boolean().describe('Whether the article is likely to be credible or not.'),
  confidenceScore: z.number().describe('A confidence score (0-100) indicating the AI\'s certainty about the article\'s credibility.'),
  explanation: z.string().describe('A detailed explanation of why the AI believes the article is credible or not, including specific indicators.'),
});
export type AnalyzeArticleOutput = z.infer<typeof AnalyzeArticleOutputSchema>;

export async function analyzeArticle(input: AnalyzeArticleInput): Promise<AnalyzeArticleOutput> {
  return analyzeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeArticlePrompt',
  input: {
    schema: z.object({
      articleText: z.string().describe('The text of the news article to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      isCredible: z.boolean().describe('Whether the article is likely to be credible or not.'),
      confidenceScore: z.number().describe('A confidence score (0-100) indicating the AI\'s certainty about the article\'s credibility.'),
      explanation: z.string().describe('A detailed explanation of why the AI believes the article is credible or not, including specific indicators.'),
    }),
  },
  prompt: `You are an AI assistant tasked with analyzing the credibility of news articles.
  Your analysis should consider factors such as:
  1. The presence of sensationalized language
  2. Unsupported claims
  3. The source's reputation
  4. Factual inconsistencies
  5. Claims about future events (especially those beyond the model's training data cutoff)

  Important: When analyzing articles about future events:
  - If the article makes claims about events beyond the model's training data cutoff (2023), mark it as potentially unreliable
  - Focus on analyzing the source's credibility and the presence of factual evidence
  - Avoid making predictions about future events
  - Highlight any claims that cannot be verified with historical data

  Analyze the following article and determine if it is credible or not. Provide a confidence score between 0 and 100.
  Explain your reasoning by highlighting specific indicators within the article that influenced your decision.

  Article:
  {{{articleText}}}

  Analysis:`,
});

const analyzeArticleFlow = ai.defineFlow<
  typeof AnalyzeArticleInputSchema,
  typeof AnalyzeArticleOutputSchema
>(
  {
    name: 'analyzeArticleFlow',
    inputSchema: AnalyzeArticleInputSchema,
    outputSchema: AnalyzeArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
