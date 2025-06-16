import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Filter, Clock } from "lucide-react";

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: baajuses } = useQuery({
    queryKey: ["/api/baajuses"],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/filter-results"],
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your content filtering performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Filters</p>
                <p className="text-2xl font-bold text-gray-900">
                  {baajuses?.length || 0}
                </p>
              </div>
              <Filter className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.contentFiltered?.toLocaleString() || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageAccuracy ? `${(stats.averageAccuracy * 100).toFixed(1)}%` : "0%"}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Filters</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeBaajuses || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Baajus Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Baajus Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {baajuses?.map((baajus: any) => (
                <div key={baajus.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{baajus.name}</h4>
                    <p className="text-sm text-gray-500">
                      {baajus.usageCount || 0} uses • {baajus.sensitivity} sensitivity
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {baajus.accuracyRate ? `${(baajus.accuracyRate * 100).toFixed(1)}%` : "New"}
                    </div>
                    <Badge 
                      variant={baajus.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {baajus.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!baajuses || baajuses.length === 0) && (
                <p className="text-gray-500 text-center py-8">No Baajuses to analyze</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Filter Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.slice(0, 10).map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Content {activity.isBlocked ? "blocked" : "approved"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round(activity.confidence * 100)}% confidence • {" "}
                      {new Date(activity.createdAt).toLocaleDateString()}
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
    </div>
  );
}
