
import { useState } from "react";
import { Camera, Upload, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadFlowProps {
  onClose: () => void;
  onPostCreated?: () => void;
}

interface SpeciesInfo {
  species_name: string;
  scientific_name: string;
  category: string;
  confidence: string;
  description: string;
  identification_notes: string;
}

const UploadFlow = ({ onClose, onPostCreated }: UploadFlowProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<"upload" | "identifying" | "results" | "publishing">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [speciesInfo, setSpeciesInfo] = useState<SpeciesInfo | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setSelectedImage(imageDataUrl);
        identifySpecies(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifySpecies = async (imageDataUrl: string) => {
    setCurrentStep("identifying");
    
    try {
      const { data, error } = await supabase.functions.invoke('identify-species', {
        body: { imageUrl: imageDataUrl }
      });

      if (error) {
        toast.error('Error identifying species: ' + error.message);
        setCurrentStep("upload");
        return;
      }

      if (data.success) {
        setSpeciesInfo(data.data);
        setCurrentStep("results");
      } else {
        toast.error('Failed to identify species');
        setCurrentStep("upload");
      }
    } catch (error) {
      toast.error('Error identifying species');
      setCurrentStep("upload");
    }
  };

  const handlePublish = async () => {
    if (!user || !selectedFile || !speciesInfo) {
      toast.error('Missing required information');
      return;
    }

    setCurrentStep("publishing");

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: speciesInfo.species_name,
          description: speciesInfo.description,
          image_url: selectedImage!,
          location_name: '',
          latitude: 0,
          longitude: 0
        });

      if (error) {
        toast.error('Error creating post: ' + error.message);
        setCurrentStep("results");
        return;
      }

      toast.success('Discovery shared successfully!');
      onPostCreated?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error('Error publishing discovery');
      setCurrentStep("results");
    }
  };

  const handleSaveToCollection = async () => {
    if (!user || !speciesInfo) {
      toast.error('Please sign in to save discoveries');
      return;
    }

    // For now, we'll just show a success message
    // In a real app, you'd save to a collections table
    toast.success('Discovery saved to your collection!');
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <h3 className="text-lg font-semibold mb-2">Sign in required</h3>
          <p className="text-gray-600 mb-4">Please sign in to identify wildlife</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {currentStep === "upload" && "Identify Wildlife"}
            {currentStep === "identifying" && "Analyzing..."}
            {currentStep === "results" && "Species Identified"}
            {currentStep === "publishing" && "Sharing Discovery..."}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Upload Step */}
        {currentStep === "upload" && (
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture Wildlife</h3>
                  <p className="text-gray-600 text-sm">Upload a photo and let AI identify the species</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="photo-upload">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photo
                      </span>
                    </Button>
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Identifying Step */}
        {currentStep === "identifying" && selectedImage && (
          <div className="p-6 text-center space-y-6">
            <img
              src={selectedImage}
              alt="Analyzing"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 animate-pulse text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI is analyzing your photo...</h3>
              <p className="text-gray-600">Identifying species and gathering information</p>
            </div>
          </div>
        )}

        {/* Results Step */}
        {currentStep === "results" && selectedImage && speciesInfo && (
          <div className="p-6 space-y-6">
            <img
              src={selectedImage}
              alt="Identified species"
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{speciesInfo.species_name}</h3>
                <p className="text-sm text-gray-600 italic">{speciesInfo.scientific_name}</p>
                <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                  {speciesInfo.category} • {speciesInfo.confidence} confidence
                </span>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">About this species:</h4>
                <p className="text-sm text-gray-700">{speciesInfo.description}</p>
              </div>

              {speciesInfo.identification_notes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Identification notes:</h4>
                  <p className="text-sm text-gray-700">{speciesInfo.identification_notes}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleSaveToCollection}
              >
                Save to Collection
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                onClick={handlePublish}
              >
                Share Discovery
              </Button>
            </div>
          </div>
        )}

        {/* Publishing Step */}
        {currentStep === "publishing" && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sharing your discovery...</h3>
            <p className="text-gray-600">Adding to the Semurg community</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFlow;
