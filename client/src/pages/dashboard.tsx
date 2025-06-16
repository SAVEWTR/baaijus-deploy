import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Shield, Target, DollarSign, ArrowUp, Plus, Upload, Share2, BarChart3, Filter, Clock, Crown, Users, TrendingUp, Download, Activity, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LiveDemo from "@/components/live-demo";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');

  const isAdmin = user?.role === 'master_admin' || user?.role === 'admin';

  // User queries - always loaded for user view
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: viewMode === 'user'
  });

  const { data: baajuses } = useQuery({
    queryKey: ["/api/baajuses"],
    enabled: viewMode === 'user'
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/filter-results", "10"],
    enabled: viewMode === 'user'
  });

  // Admin queries - only loaded for admin view
  const { data: revenue } = useQuery({
    queryKey: ["/api/admin/revenue"],
    enabled: viewMode === 'admin' && isAdmin
  });

  const { data: signups } = useQuery({
    queryKey: ["/api/admin/signups"],
    enabled: viewMode === 'admin' && isAdmin
  });

  const { data: popularBaaijuses } = useQuery({
    queryKey: ["/api/admin/popular-baaijuses"],
    enabled: viewMode === 'admin' && isAdmin
  });

  const { data: allUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: viewMode === 'admin' && isAdmin
  });

  const recentBaajuses = baajuses?.slice(0, 3) || [];

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/export');
      const data = await response.json();
      
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `baaijus-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Role Toggle */}
      {isAdmin && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {viewMode === 'admin' ? (
                <>
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  Master Admin Dashboard
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6 text-primary mr-2" />
                  Personal Dashboard
                </>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              {viewMode === 'admin' 
                ? 'Platform overview and management controls' 
                : 'Your personal Baaijuses and activity'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={viewMode} onValueChange={(value: 'user' | 'admin') => setViewMode(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Personal Dashboard</SelectItem>
                <SelectItem value="admin">Master Admin View</SelectItem>
              </SelectContent>
            </Select>
            
            {viewMode === 'admin' && (
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Content Based on View Mode */}
      {viewMode === 'admin' && isAdmin ? (
        <>
          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${revenue?.revenue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{revenue?.monthlyGrowth || 0}% this month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allUsers?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-blue-600 flex items-center">
                    <UserCheck className="w-4 h-4 mr-1" />
                    {signups?.active || 0} active
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Signups</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {signups?.new || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <UserX className="w-4 h-4 mr-1" />
                    {signups?.churned || 0} churned
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {signups?.paid || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600">
                    {signups?.free || 0} free users
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Baaijuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularBaaijuses?.map((baajus: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{baajus.name}</h4>
                        <p className="text-sm text-gray-500">by {baajus.creator}</p>
                      </div>
                      <Badge variant="secondary">
                        {baajus.uses} uses
                      </Badge>
                    </div>
                  ))}
                  {(!popularBaaijuses || popularBaaijuses.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers?.slice(0, 5).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{user.username}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'master_admin' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                  {(!allUsers || allUsers.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No users found</p>
                  )}
                </div>
                {allUsers && allUsers.length > 5 && (
                  <Button variant="ghost" className="w-full mt-4">
                    View All Users ({allUsers.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* User Dashboard - Personal Stats */}
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
        </>
      )}
    </div>
  );
}
