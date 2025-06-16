import LiveDemo from "@/components/live-demo";

export default function Demo() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Live Demo Filter</h1>
          <p className="text-gray-600 text-lg">
            Test your Baajuses with real-time content analysis powered by AI
          </p>
        </div>
        
        <LiveDemo />
      </div>
    </div>
  );
}
