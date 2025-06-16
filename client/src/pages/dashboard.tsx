import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Target, DollarSign, ArrowUp, Plus, Upload, Share2, BarChart3, Filter, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LiveDemo from "@/components/live-demo";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: baajuses } = useQuery({
    queryKey: ["/api/baajuses"],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/filter-results", "10"],
  });

  const recentBaajuses = baajuses?.slice(0, 3) || [];

  return (
    <div className="p-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Baajuses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeBaajuses || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +2 this week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Filtered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.contentFiltered?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +15% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageAccuracy ? `${(stats.averageAccuracy * 100).toFixed(1)}%` : "0%"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +0.3% improvement
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentActivity?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +2 vs last week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Demo Filter */}
        <div className="lg:col-span-2">
          <LiveDemo />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Baajuses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Baajuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBaajuses.map((baajus: any) => (
                  <div key={baajus.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{baajus.name}</h4>
                      <p className="text-sm text-gray-500">
                        Updated {new Date(baajus.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-green-600">
                        {baajus.accuracyRate ? `${(baajus.accuracyRate * 100).toFixed(1)}%` : "New"}
                      </span>
                      <p className="text-xs text-gray-500">accuracy</p>
                    </div>
                  </div>
                ))}
                {recentBaajuses.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No baajuses created yet</p>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => setLocation("/baajuses")}
              >
                View All Baajuses
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                  onClick={() => setLocation("/baajuses")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Baajus
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Filter Set
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Collection
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation("/analytics")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity?.slice(0, 5).map((activity: any) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Filter className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">Content filtered</span> using AI analysis
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant={activity.isBlocked ? "destructive" : "default"}>
                  {activity.isBlocked ? "Blocked" : "Approved"}
                </Badge>
              </div>
            ))}
            {(!recentActivity || recentActivity.length === 0) && (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
