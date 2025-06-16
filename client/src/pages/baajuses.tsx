import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Brain, Settings, Trash2, Eye, Share2 } from "lucide-react";
import CreateBaajusDialog from "@/components/create-baajus-dialog";

export default function Baajuses() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: baajuses, isLoading } = useQuery({
    queryKey: ["/api/baajuses"],
  });

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "permissive": return "bg-blue-100 text-blue-700";
      case "balanced": return "bg-green-100 text-green-700";
      case "strict": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Baajuses</h1>
          <p className="text-gray-600 mt-2">Create and manage your custom bias profiles</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Baajus
        </Button>
      </div>

      {/* Baajuses Grid */}
      {baajuses && baajuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {baajuses.map((baajus: any) => (
            <Card key={baajus.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{baajus.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getSensitivityColor(baajus.sensitivity)}>
                          {baajus.sensitivity}
                        </Badge>
                        {baajus.isPublic && (
                          <Badge variant="outline">Public</Badge>
                        )}
                        {!baajus.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {baajus.description || "No description provided"}
                </p>
                
                {baajus.keywords && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {baajus.keywords.split(',').slice(0, 3).map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword.trim()}
                        </Badge>
                      ))}
                      {baajus.keywords.split(',').length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{baajus.keywords.split(',').length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Accuracy</p>
                    <p className="font-medium">
                      {baajus.accuracyRate ? `${(baajus.accuracyRate * 100).toFixed(1)}%` : "New"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Usage</p>
                    <p className="font-medium">{baajus.usageCount || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Baajuses Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first bias profile to start filtering content with AI
          </p>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Baajus
          </Button>
        </div>
      )}

      <CreateBaajusDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
    </div>
  );
}
