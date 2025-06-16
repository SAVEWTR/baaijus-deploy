import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Zap, Users, BarChart3, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Baaijus</h1>
                <p className="text-xs text-gray-500">AI Content Filtering</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center mt-24">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Content Filtering <span className="text-[#7059e3]">Made Personal</span>
          </h1>
          <div className="inline-block mb-4 bg-[#eaeaea] text-[#7059e3] px-4 py-2 rounded-full font-bold text-sm tracking-wider">
            PATENT PENDING
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-[650px] mx-auto leading-relaxed">
            Create custom bias profiles called "Baajuses" to filter and curate content across all your devices and nearly all content types.<br />
            Control what you see with personalized sensitivity levels and semantic understanding.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg px-8 py-3"
              >
                Start Filtering
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Baaijus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Custom Baajuses</CardTitle>
                <CardDescription>
                  Create personalized bias profiles to filter content exactly how you want
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Advanced semantic understanding goes beyond simple keyword matching
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Real-time Filtering</CardTitle>
                <CardDescription>
                  Instant content analysis with configurable sensitivity levels
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Collaborative Filters</CardTitle>
                <CardDescription>
                  Share and discover community-created Baajuses for different use cases
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track filter performance and content analysis insights
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Settings className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Fine-grained Control</CardTitle>
                <CardDescription>
                  Adjust bias detection sensitivity from permissive to strict
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Take Control of Your Content?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using Baaijus to create personalized, intelligent content filters.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Baaijus</span>
          </div>
          <p className="text-gray-400 mb-8">
            AI-powered content filtering made personal
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 Baaijus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}