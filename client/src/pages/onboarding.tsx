import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Settings, 
  Chrome, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  User,
  Play
} from "lucide-react";

export default function Onboarding() {
  const handleDownload = () => {
    window.open('/baaijus-extension.zip', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Get Started with Baaijus</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Install the Baaijus browser extension to start filtering content across the web with your personalized bias profiles.
        </p>
        <Badge variant="secondary" className="text-sm">Patent Pending Technology</Badge>
      </div>

      {/* Step 1: Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <Download className="h-5 w-5" />
            Download the Extension
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Download the Baaijus extension ZIP file to your computer. The extension works with Chrome, Edge, and Brave browsers.
          </p>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Baaijus Extension
          </Button>
          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Chrome className="h-4 w-4" />
              Chrome
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Edge
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Brave
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Extract */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <Settings className="h-5 w-5" />
            Extract the Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Extract the downloaded ZIP file to a folder on your computer. Remember the location as you'll need it in the next step.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Important</p>
                <p className="text-sm text-gray-600">
                  Keep the extracted folder in a permanent location. Don't delete it after installation as the browser needs these files to run the extension.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Install */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <Chrome className="h-5 w-5" />
            Install in Your Browser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Follow these steps to install the extension in your browser:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">a</div>
              <div>
                <p className="font-medium">Open Extension Settings</p>
                <p className="text-sm text-gray-600">
                  Type <code className="bg-gray-100 px-1 py-0.5 rounded">chrome://extensions/</code> in your address bar and press Enter
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">b</div>
              <div>
                <p className="font-medium">Enable Developer Mode</p>
                <p className="text-sm text-gray-600">
                  Toggle the "Developer mode" switch in the top-right corner
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">c</div>
              <div>
                <p className="font-medium">Load Unpacked Extension</p>
                <p className="text-sm text-gray-600">
                  Click "Load unpacked" and select the folder where you extracted the Baaijus extension
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">d</div>
              <div>
                <p className="font-medium">Pin the Extension</p>
                <p className="text-sm text-gray-600">
                  Click the puzzle piece icon in your toolbar and pin Baaijus for easy access
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Connect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <User className="h-5 w-5" />
            Connect Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Click the Baaijus icon in your browser toolbar and sign in with your account credentials to start filtering content.
          </p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Ready to Go!</p>
                <p className="text-sm text-green-700">
                  Once connected, your Baaijus filters will automatically apply to web content as you browse.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Start Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
            <Play className="h-5 w-5" />
            Start Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Visit any website and your active Baaijus will automatically filter content based on your preferences. Toggle filtering on/off using the extension popup.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Create Baaijus</h4>
              <p className="text-sm text-gray-600">
                Set up custom bias profiles with specific keywords and sensitivity levels
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Real-time Filtering</h4>
              <p className="text-sm text-gray-600">
                Content is analyzed and filtered as you browse using AI-powered semantic understanding
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-orange-900">
            <AlertCircle className="h-5 w-5" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-orange-900">Extension won't load?</p>
            <p className="text-sm text-orange-700">Make sure Developer mode is enabled and you selected the correct folder</p>
          </div>
          <div>
            <p className="font-medium text-orange-900">Can't sign in?</p>
            <p className="text-sm text-orange-700">Verify your internet connection and ensure your account credentials are correct</p>
          </div>
          <div>
            <p className="font-medium text-orange-900">Filtering not working?</p>
            <p className="text-sm text-orange-700">Check that filtering is enabled in the extension popup and you have active Baaijus</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button asChild variant="outline">
          <a href="/dashboard">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
}