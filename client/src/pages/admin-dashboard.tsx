import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Users, TrendingUp, Download, Activity, Crown, Shield, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');

  // Admin-specific queries
  const { data: revenue } = useQuery({
    queryKey: ["/api/admin/revenue"],
    enabled: viewMode === 'admin'
  });

  const { data: signups } = useQuery({
    queryKey: ["/api/admin/signups"],
    enabled: viewMode === 'admin'
  });

  const { data: popularBaaijuses } = useQuery({
    queryKey: ["/api/admin/popular-baaijuses"],
    enabled: viewMode === 'admin'
  });

  const { data: allUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: viewMode === 'admin'
  });

  // Regular user queries (for user view mode)
  const { data: userStats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: viewMode === 'user'
  });

  const { data: userBaajuses } = useQuery({
    queryKey: ["/api/baajuses"],
    enabled: viewMode === 'user'
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/export');
      const data = await response.json();
      
      // Create and trigger download
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

  const isAdmin = user?.role === 'master_admin' || user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            Master Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Platform overview and management controls</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">User View</span>
            <Switch
              checked={viewMode === 'admin'}
              onCheckedChange={(checked) => setViewMode(checked ? 'admin' : 'user')}
            />
            <span className="text-sm font-medium">Admin View</span>
          </div>
          
          {viewMode === 'admin' && (
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>
      </div>

      {viewMode === 'admin' ? (
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
            {/* Popular Baaijuses */}
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

            {/* User Management */}
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
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'master_admin' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
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
          {/* User View - Regular Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Baajuses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats?.activeBaajuses || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Content Filtered</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats?.contentFiltered?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats?.averageAccuracy ? `${(userStats.averageAccuracy * 100).toFixed(1)}%` : "0%"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User View - My Baajuses */}
          <Card>
            <CardHeader>
              <CardTitle>My Baajuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBaajuses?.map((baajus: any) => (
                  <div key={baajus.id} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{baajus.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{baajus.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={baajus.isActive ? "default" : "secondary"}>
                        {baajus.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {baajus.usageCount} uses
                      </span>
                    </div>
                  </div>
                ))}
                {(!userBaajuses || userBaajuses.length === 0) && (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No baajuses created yet</p>
                    <Button className="mt-4">Create Your First Baajus</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}