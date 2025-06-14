
import { FileText } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-2xl border border-white/20">
              <FileText className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">GenContract</h1>
              <p className="text-sm text-white/80 drop-shadow-md">AI Contract Generator</p>
            </div>
          </div>
          <div className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
            v1.0 Beta
          </div>
        </div>
      </div>
    </header>
  );
};
