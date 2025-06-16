import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Search, Chrome } from "lucide-react";

const pageData = {
  "/": {
    title: "Dashboard",
    description: "Manage your content filters and view analytics"
  },
  "/baajuses": {
    title: "My Baajuses",
    description: "Create and manage your bias profiles"
  },
  "/demo": {
    title: "Live Demo",
    description: "Test your filters with real-time content analysis"
  },
  "/analytics": {
    title: "Analytics",
    description: "View detailed performance metrics"
  },
  "/settings": {
    title: "Settings",
    description: "Configure your account and preferences"
  }
};

export default function Topbar() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");


  const currentPage = pageData[location as keyof typeof pageData] || pageData["/"];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentPage.title}</h2>
          <p className="text-gray-500">{currentPage.description}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search filters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>
          


          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Create New Filter Button */}
          <Button 
            onClick={() => setLocation("/baajuses")}
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Baajus
          </Button>
        </div>
      </div>
    </header>
  );
}
