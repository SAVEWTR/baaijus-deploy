import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Chrome, Globe, CheckCircle, AlertCircle, Play, Settings, Shield } from "lucide-react";

export default function Extension() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    // Create a download link for the extension ZIP
    const link = document.createElement('a');
    link.href = '/baaijus-extension-polished.zip';
    link.download = 'baaijus-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Install Baaijus Browser Extension
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Filter content across the web with your custom Baajuses. 
            Works on any website with real-time content analysis.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Extension Status</h3>
                <p className="text-orange-700">
                  Not detected. Follow the installation steps below to get started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Step 1: Download Extension</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Baaijus Extension
              </Button>
              {downloadStarted && (
                <p className="text-green-600 mt-3 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Download started! Check your downloads folder.
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Compatible Browsers:</h4>
              <div className="flex space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Chrome className="w-4 h-4" />
                  <span>Chrome</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>Edge</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Chrome className="w-4 h-4" />
                  <span>Brave</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Step 2: Install Extension</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Extract the ZIP file</h4>
                  <p className="text-gray-600">
                    Right-click the downloaded ZIP file and select "Extract All" or use your preferred extraction tool.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Open Chrome Extensions</h4>
                  <p className="text-gray-600 mb-2">
                    Go to <code className="bg-gray-100 px-2 py-1 rounded text-sm">chrome://extensions</code> in your browser
                  </p>
                  <Button variant="outline" size="sm" onClick={() => window.open('chrome://extensions', '_blank')}>
                    <Chrome className="w-4 h-4 mr-1" />
                    Open Extensions Page
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Enable Developer Mode</h4>
                  <p className="text-gray-600">
                    Toggle the "Developer mode" switch in the top-right corner of the extensions page.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Load Unpacked Extension</h4>
                  <p className="text-gray-600">
                    Click "Load unpacked" and select the extracted Baaijus extension folder.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Log In & Start Filtering</h4>
                  <p className="text-gray-600">
                    Click the Baaijus extension icon, log in with your account, and start filtering content!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Extension Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Real-time Filtering</h4>
                <p className="text-sm text-gray-600">
                  Automatically filters content as you browse using your custom Baajuses
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">One-Click Toggle</h4>
                <p className="text-sm text-gray-600">
                  Easily enable or disable filtering with a single click from any page
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Sync Settings</h4>
                <p className="text-sm text-gray-600">
                  Your Baajuses automatically sync across all your devices
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Common Issues:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Make sure Developer mode is enabled in Chrome extensions</li>
                  <li>• Select the extracted folder, not the ZIP file</li>
                  <li>• Refresh the page after installation to see changes</li>
                  <li>• Check that you're logged in to the same Baaijus account</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Still having trouble? Contact our support team at{" "}
                  <a href="mailto:support@baaijus.com" className="text-primary hover:underline">
                    support@baaijus.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}