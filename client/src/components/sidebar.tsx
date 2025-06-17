import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Brain, BarChart3, Play, Settings, Share2, LayoutDashboard, LogOut, User, Crown, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const baseNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Baajuses", href: "/baajuses", icon: Brain },
  { name: "Live Demo", href: "/demo", icon: Play },
  { name: "Browser Extension", href: "/extension", icon: Puzzle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Shared Filters", href: "/shared", icon: Share2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Master Admin", href: "/admin", icon: Crown },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === 'master_admin' || user?.role === 'admin';
  const navigation = isAdmin 
    ? [...baseNavigation, ...adminNavigation] 
    : baseNavigation;

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Baaijus</h1>
            <p className="text-xs text-gray-500">AI Content Filtering</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            const isAdminItem = adminNavigation.some(nav => nav.href === item.href);
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => setLocation(item.href)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isAdminItem && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Admin
                    </Badge>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {user?.firstName || user?.email || "User"}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">Pro Plan</p>
              {isAdmin && (
                <Badge variant="destructive" className="text-xs">
                  {user?.role === 'master_admin' ? 'Master' : 'Admin'}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
              } catch (error) {
                console.error('Logout failed:', error);
                window.location.href = '/';
              }
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
