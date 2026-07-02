import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ObjectUploaderProps {
  currentImage?: string;
  onUploadComplete: (url: string) => void;
}

export function ObjectUploader({ currentImage, onUploadComplete }: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Client-Side Size Check (Limit to 4MB to be safe)
    if (file.size > 4 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 4MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 2. Attempt Upload
      const res = await fetch("/api/objects/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Server rejected the upload");
      }

      const data = await res.json();

      // 3. Success
      setPreview(data.url);
      onUploadComplete(data.url);
      toast({ title: "Success", description: "Image uploaded and saved." });

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Network error. Try a smaller image or use a URL.",
      });
    } finally {
      setIsUploading(false);
      // Reset input so you can select the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileSelect}
      />

      {/* Upload Area */}
      {!preview ? (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
            ${isUploading ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-300 hover:border-amber-500 hover:bg-amber-50/50'}
          `}
        >
          {isUploading ? (
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500 font-medium">Compressing & Saving...</p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Click to upload image</p>
                <p className="text-xs text-slate-500 mt-1">Max 4MB (JPG, PNG, WebP)</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Preview Area */
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button 
              type="button"
              variant="secondary" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </Button>
            <Button 
              type="button"
              variant="destructive" 
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}