import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Brain, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LiveDemo() {
  const [content, setContent] = useState("");
  const [sensitivity, setSensitivity] = useState([75]);
  const [selectedBaajuses, setSelectedBaajuses] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  
  const { toast } = useToast();

  const { data: baajuses } = useQuery({
    queryKey: ["/api/baajuses"],
  });

  const filterMutation = useMutation({
    mutationFn: async ({ content, baajusId }: { content: string; baajusId: number }) => {
      const response = await apiRequest("POST", "/api/filter", { content, baajusId });
      return response.json();
    },
    onSuccess: (result) => {
      setLastResult(result);
      toast({
        title: "Content Analyzed",
        description: result.isBlocked ? "Content was blocked" : "Content approved",
        variant: result.isBlocked ? "destructive" : "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activeBaajuses = baajuses?.filter((b: any) => selectedBaajuses.includes(b.id)) || [];

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }

    if (selectedBaajuses.length === 0) {
      toast({
        title: "No Filter Selected",
        description: "Please select at least one Baajus to use for filtering",
        variant: "destructive",
      });
      return;
    }

    // Use the first selected baajus for demo
    filterMutation.mutate({
      content,
      baajusId: selectedBaajuses[0],
    });
  };

  const getSensitivityLabel = (value: number) => {
    if (value < 30) return "Permissive";
    if (value < 70) return "Balanced";
    return "Strict";
  };

  const toggleBaajus = (baajusId: number) => {
    setSelectedBaajuses(prev => 
      prev.includes(baajusId) 
        ? prev.filter(id => id !== baajusId)
        : [...prev, baajusId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Demo Filter</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            <Badge variant="default" className="bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
              Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sensitivity Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content Sensitivity Level
          </label>
          <div className="space-y-2">
            <Slider
              value={sensitivity}
              onValueChange={setSensitivity}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Permissive</span>
              <span>Balanced</span>
              <span>Strict</span>
            </div>
            <div className="text-sm text-primary font-medium">
              Current: {sensitivity[0]}% ({getSensitivityLabel(sensitivity[0])})
            </div>
          </div>
        </div>

        {/* Available Baajuses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Baajuses to Use
          </label>
          <div className="flex flex-wrap gap-2">
            {baajuses?.map((baajus: any) => (
              <button
                key={baajus.id}
                onClick={() => toggleBaajus(baajus.id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedBaajuses.includes(baajus.id)
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                <Brain className="w-3 h-3 mr-1" />
                {baajus.name}
                {selectedBaajuses.includes(baajus.id) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </button>
            ))}
            {(!baajuses || baajuses.length === 0) && (
              <p className="text-gray-500 text-sm">No Baajuses created yet</p>
            )}
          </div>
        </div>

        {/* Active Baajuses Display */}
        {activeBaajuses.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Active Baajuses
            </label>
            <div className="flex flex-wrap gap-2">
              {activeBaajuses.map((baajus: any) => (
                <Badge
                  key={baajus.id}
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  {baajus.name}
                  <button
                    onClick={() => toggleBaajus(baajus.id)}
                    className="ml-2 text-primary/60 hover:text-primary"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Test Content
          </label>
          <Textarea
            placeholder="Enter content to test your filters..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-32 resize-none"
          />
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={filterMutation.isPending || !content.trim() || selectedBaajuses.length === 0}
          className="w-full"
        >
          {filterMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Analyze Content
        </Button>

        {/* Results */}
        {lastResult && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Filter Results</h4>
              {lastResult.isBlocked ? (
                <span className="text-sm text-red-600 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  Content Blocked
                </span>
              ) : (
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Content Approved
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Confidence Level</span>
                <span className="font-medium">
                  {Math.round(lastResult.confidence * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sentiment</span>
                <span className="capitalize">{lastResult.sentiment}</span>
              </div>
              {lastResult.matchedKeywords?.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600">Matched Keywords: </span>
                  <span className="font-medium">{lastResult.matchedKeywords.join(", ")}</span>
                </div>
              )}
            </div>

            {lastResult.analysis && (
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Analysis:</strong> {lastResult.analysis}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
