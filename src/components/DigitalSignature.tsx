
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, Upload, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DigitalSignatureProps {
  onSignatureChange: (signatures: { [key: string]: string }) => void;
  parties: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalSignature = ({ onSignatureChange, parties, isOpen, onClose }: DigitalSignatureProps) => {
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});
  const [isDrawing, setIsDrawing] = useState<{ [key: string]: boolean }>({});
  const [activeParty, setActiveParty] = useState<string>('');
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && parties.length > 0) {
      setActiveParty(parties[0]);
      // Clear signatures when reopening
      setSignatures({});
      // Clear all canvases
      parties.forEach(party => {
        const canvas = canvasRefs.current[party];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
    }
  }, [isOpen, parties]);

  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000000';
    }
  };

  const getMousePos = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (party: string, e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[party];
    if (!canvas) return;
    
    setupCanvas(canvas);
    setIsDrawing(prev => ({ ...prev, [party]: true }));
    
    const pos = getMousePos(canvas, e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (party: string, e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing[party]) return;
    
    const canvas = canvasRefs.current[party];
    if (!canvas) return;
    
    const pos = getMousePos(canvas, e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (party: string) => {
    setIsDrawing(prev => ({ ...prev, [party]: false }));
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRefs.current[party];
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Scale image to fit canvas while maintaining aspect ratio
              const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
              const width = img.width * scale;
              const height = img.height * scale;
              const x = (canvas.width - width) / 2;
              const y = (canvas.height - height) / 2;
              
              ctx.drawImage(img, x, y, width, height);
              
              const signatureData = canvas.toDataURL();
              const updatedSignatures = { ...signatures, [party]: signatureData };
              setSignatures(updatedSignatures);
              onSignatureChange(updatedSignatures);
              
              toast({
                title: "Signature Uploaded",
                description: `Signature for ${party} has been uploaded successfully.`,
              });
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <PenTool className="w-5 h-5" />
            Digital Signatures
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Party Tabs */}
          <div className="flex gap-2 border-b">
            {parties.map((party) => (
              <Button
                key={party}
                variant={activeParty === party ? "default" : "ghost"}
                className="rounded-b-none"
                onClick={() => setActiveParty(party)}
              >
                {party}
                {signatures[party] && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                )}
              </Button>
            ))}
          </div>

          {/* Active Party Signature */}
          {activeParty && (
            <div className="space-y-4">
              <Label className="font-medium text-gray-900 text-lg">
                {activeParty} - Please Sign Below
              </Label>
              
              {/* Drawing Canvas */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={(el) => { 
                    if (el) {
                      canvasRefs.current[activeParty] = el;
                    }
                  }}
                  width={600}
                  height={200}
                  className="w-full h-32 border-2 border-gray-300 rounded bg-white cursor-crosshair"
                  onMouseDown={(e) => startDrawing(activeParty, e)}
                  onMouseMove={(e) => draw(activeParty, e)}
                  onMouseUp={() => stopDrawing(activeParty)}
                  onMouseLeave={() => stopDrawing(activeParty)}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Draw your signature above or upload an image below
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => clearSignature(activeParty)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Signature
                </Button>
                <label className="flex-1">
                  <Button variant="outline" asChild className="w-full">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadSignature(activeParty, e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Signature Preview */}
              {signatures[activeParty] && (
                <div className="mt-4">
                  <Label className="text-sm text-green-600 font-medium">✓ Signature Captured</Label>
                  <div className="mt-2 border rounded p-2 bg-green-50">
                    <img 
                      src={signatures[activeParty]} 
                      alt={`${activeParty} signature`}
                      className="max-h-16 mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Complete Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onClose}
              disabled={Object.keys(signatures).length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Signatures ({Object.keys(signatures).length}/{parties.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
