import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Zap, Users, BarChart3, Settings } from "lucide-react";

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
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Content Filtering
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              Made Personal
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create custom bias profiles called "Baajuses" to filter and curate content with advanced AI. 
            Control what you see with personalized sensitivity levels and semantic understanding.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              Start Filtering
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
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
                <Shield className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>AI-Powered</CardTitle>
                <CardDescription>
                  Advanced semantic analysis using OpenAI for accurate content understanding
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Real-time Filtering</CardTitle>
                <CardDescription>
                  Instant content analysis with adjustable sensitivity levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-success mb-4" />
                <CardTitle>Share & Collaborate</CardTitle>
                <CardDescription>
                  Share your filter profiles with others or use community-created filters
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-warning mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track filtering performance and accuracy with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="w-12 h-12 text-error mb-4" />
                <CardTitle>Full Control</CardTitle>
                <CardDescription>
                  Fine-tune every aspect of your content filtering experience
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
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already filtering content their way
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Baaijus</span>
            </div>
            <p className="text-gray-400">© 2025 Baaijus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
