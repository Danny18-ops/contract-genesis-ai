
import { FileText } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GenContract</h1>
              <p className="text-xs text-gray-500">AI Contract Generator</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            v1.0 Beta
          </div>
        </div>
      </div>
    </header>
  );
};
