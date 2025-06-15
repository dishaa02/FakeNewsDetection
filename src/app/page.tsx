'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { analyzeArticle, AnalyzeArticleOutput } from '@/ai/flows/analyze-article';
import { Loader2 } from 'lucide-react'; // Spinner icon
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  const [text, setText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeArticleOutput | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const result = await analyzeArticle({ articleText: text });
      const endTime = performance.now();
      setAnalysisResult(result);
      setResponseTime((endTime - startTime) / 1000); // seconds
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = () => {
    if (!analysisResult) return 'default';
    return analysisResult.isCredible ? 'default' : 'destructive';
  };

  const getBadgeText = () => {
    if (!analysisResult) return 'Awaiting Analysis';
    return analysisResult.isCredible ? 'Real' : 'Fake';
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
        Factual AI - Fake News Detection
      </h1>

      {/* Date Limitation Note */}
      <div className="text-center mb-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Note: This model can analyze news articles up to October 2023. Articles about events beyond this date may be marked as potentially unreliable.
        </p>
      </div>

      {/* Content Submission Card */}
      <Card className="bg-card shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Submit Content for Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the news article text below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste news article text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-4 rounded-md shadow-sm"
          />
          <Button
            onClick={analyzeText}
            className="w-full rounded-md shadow-md"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              'Analyze Text'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results Card */}
      {analysisResult && (
        <Card className="bg-card shadow-md rounded-lg mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              {/* Badge Display */}
              <Badge
                variant={getBadgeVariant()}
                className="text-lg font-semibold px-4 py-2 rounded-full"
              >
                {getBadgeText()}
              </Badge>

              {/* Confidence Score */}
              <p className="mt-3 text-muted-foreground">
                Confidence Score:{' '}
                <span className="font-semibold text-foreground">
                  {analysisResult.confidenceScore.toFixed(2)}%
                </span>
              </p>

              {/* Explanation */}
              <p className="mt-3 text-muted-foreground">
                {analysisResult.isCredible ? (
                  <span className="font-semibold text-foreground">
                    The article is likely to be real because:
                  </span>
                ) : (
                  <span className="font-semibold text-foreground">
                    The article is likely to be fake because:
                  </span>
                )}
              </p>
              <p className="mt-2 text-foreground">{analysisResult.explanation}</p>

              {/* Response Time */}
              {responseTime !== null && (
                <p className="mt-3 text-muted-foreground">
                  Response Time:{' '}
                  <span className="font-semibold text-foreground">
                    {responseTime.toFixed(3)} seconds
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


