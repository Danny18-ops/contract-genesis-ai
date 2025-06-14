
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DigitalSignatureProps {
  onSignatureChange: (signatures: { [key: string]: string }) => void;
  parties: string[];
}

export const DigitalSignature = ({ onSignatureChange, parties }: DigitalSignatureProps) => {
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});
  const [isDrawing, setIsDrawing] = useState<{ [key: string]: boolean }>({});
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const { toast } = useToast();

  const startDrawing = (party: string, e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[party];
    if (!canvas) return;
    
    setIsDrawing({ ...isDrawing, [party]: true });
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (party: string, e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing[party]) return;
    
    const canvas = canvasRefs.current[party];
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = (party: string) => {
    setIsDrawing({ ...isDrawing, [party]: false });
    const canvas = canvasRefs.current[party];
    if (canvas) {
      const signatureData = canvas.toDataURL();
      const updatedSignatures = { ...signatures, [party]: signatureData };
      setSignatures(updatedSignatures);
      onSignatureChange(updatedSignatures);
    }
  };

  const clearSignature = (party: string) => {
    const canvas = canvasRefs.current[party];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const updatedSignatures = { ...signatures };
        delete updatedSignatures[party];
        setSignatures(updatedSignatures);
        onSignatureChange(updatedSignatures);
      }
    }
  };

  const uploadSignature = (party: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const signatureData = event.target?.result as string;
        const updatedSignatures = { ...signatures, [party]: signatureData };
        setSignatures(updatedSignatures);
        onSignatureChange(updatedSignatures);
        toast({
          title: "Signature Uploaded",
          description: `Signature for ${party} has been uploaded.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <PenTool className="w-5 h-5" />
          Digital Signatures
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {parties.map((party) => (
          <div key={party} className="space-y-3">
            <Label className="font-medium text-gray-900">{party} Signature</Label>
            
            {/* Drawing Canvas */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
              <canvas
                ref={(el) => { canvasRefs.current[party] = el; }}
                width={400}
                height={150}
                className="w-full h-24 border border-gray-200 rounded cursor-crosshair"
                onMouseDown={(e) => startDrawing(party, e)}
                onMouseMove={(e) => draw(party, e)}
                onMouseUp={() => stopDrawing(party)}
                onMouseLeave={() => stopDrawing(party)}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Draw your signature above or upload an image
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearSignature(party)}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <label className="flex-1">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </span>
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadSignature(party, e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
