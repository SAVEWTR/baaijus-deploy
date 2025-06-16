import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, Settings, Trash2, Eye, Share2, MoreVertical, Users } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Baajus } from "@shared/schema";

interface BaajusCardProps {
  baajus: Baajus;
  onEdit?: (baajus: Baajus) => void;
  onView?: (baajus: Baajus) => void;
}

export default function BaajusCard({ baajus, onEdit, onView }: BaajusCardProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/baajuses/${baajus.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/baajuses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Baajus Deleted",
        description: "Your bias profile has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePublicMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", `/api/baajuses/${baajus.id}`, {
        isPublic: !baajus.isPublic,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/baajuses"] });
      toast({
        title: "Visibility Updated",
        description: `Baajus is now ${!baajus.isPublic ? "public" : "private"}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", `/api/baajuses/${baajus.id}`, {
        isActive: !baajus.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/baajuses"] });
      toast({
        title: "Status Updated",
        description: `Baajus is now ${!baajus.isActive ? "active" : "inactive"}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "permissive": 
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "balanced": 
        return "bg-green-100 text-green-700 border-green-200";
      case "strict": 
        return "bg-red-100 text-red-700 border-red-200";
      default: 
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSensitivityIcon = (sensitivity: string) => {
    switch (sensitivity) {
      case "permissive": return "🟢";
      case "balanced": return "🟡";
      case "strict": return "🔴";
      default: return "⚪";
    }
  };

  const keywords = baajus.keywords ? baajus.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this Baajus? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{baajus.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getSensitivityColor(baajus.sensitivity)}`}>
                  {getSensitivityIcon(baajus.sensitivity)} {baajus.sensitivity}
                </Badge>
                {baajus.isPublic && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                )}
                {!baajus.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(baajus)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(baajus)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => toggleActiveMutation.mutate()}
                disabled={toggleActiveMutation.isPending}
              >
                <Brain className="w-4 h-4 mr-2" />
                {baajus.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => togglePublicMutation.mutate()}
                disabled={togglePublicMutation.isPending}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Make {baajus.isPublic ? "Private" : "Public"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {baajus.description || "No description provided"}
        </p>
        
        {keywords.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
            <div className="flex flex-wrap gap-1">
              {keywords.slice(0, 3).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{keywords.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase font-medium">Accuracy</p>
            <p className="font-semibold text-lg">
              {baajus.accuracyRate ? `${(baajus.accuracyRate * 100).toFixed(1)}%` : "New"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-medium">Usage</p>
            <p className="font-semibold text-lg">{baajus.usageCount || 0}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView?.(baajus)}
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(baajus)}
              className="text-xs"
            >
              <Settings className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            Updated {new Date(baajus.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
