
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
  habitat?: string;
  diet?: string;
  behavior?: string;
  conservation_status?: string;
  interesting_facts?: string;
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
    if (!user || !speciesInfo || !selectedImage) {
      toast.error('Please sign in to save discoveries');
      return;
    }

    try {
      // First create a post in the database
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: speciesInfo.species_name,
          description: speciesInfo.description,
          image_url: selectedImage,
          location_name: '',
          latitude: 0,
          longitude: 0
        })
        .select()
        .single();

      if (postError) {
        toast.error('Error saving discovery');
        return;
      }

      // Then save it to saved_posts
      const { error: saveError } = await supabase
        .from('saved_posts')
        .insert({ user_id: user.id, post_id: postData.id });

      if (saveError) {
        toast.error('Error adding to saved collection');
        return;
      }

      toast.success('Discovery saved to your collection!');
    } catch (error) {
      toast.error('Error saving discovery');
    }
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
          <div className="relative">
            {/* Hero Image with Overlay */}
            <div className="relative h-64 rounded-t-2xl overflow-hidden">
              <img
                src={selectedImage}
                alt="Identified species"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Confidence Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  speciesInfo.confidence === 'high' 
                    ? 'bg-emerald-500/90 text-white' 
                    : speciesInfo.confidence === 'medium'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
                }`}>
                  {speciesInfo.confidence.charAt(0).toUpperCase() + speciesInfo.confidence.slice(1)} Confidence
                </span>
              </div>

              {/* Species Names Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">{speciesInfo.species_name}</h2>
                <p className="text-lg italic opacity-90 drop-shadow-md">{speciesInfo.scientific_name}</p>
              </div>
            </div>

            {/* Category Color Accent */}
            <div className={`h-1 ${
              speciesInfo.category.toLowerCase() === 'bird' ? 'bg-sky-400' :
              speciesInfo.category.toLowerCase() === 'mammal' ? 'bg-emerald-600' :
              speciesInfo.category.toLowerCase() === 'plant' ? 'bg-lime-400' :
              speciesInfo.category.toLowerCase() === 'insect' ? 'bg-amber-400' :
              speciesInfo.category.toLowerCase() === 'reptile' ? 'bg-yellow-600' :
              'bg-gray-400'
            }`} />

            {/* Content */}
            <div className="p-6 space-y-6 bg-white">
              {/* Category Tag */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  speciesInfo.category.toLowerCase() === 'bird' ? 'bg-sky-100 text-sky-800' :
                  speciesInfo.category.toLowerCase() === 'mammal' ? 'bg-emerald-100 text-emerald-800' :
                  speciesInfo.category.toLowerCase() === 'plant' ? 'bg-lime-100 text-lime-800' :
                  speciesInfo.category.toLowerCase() === 'insect' ? 'bg-amber-100 text-amber-800' :
                  speciesInfo.category.toLowerCase() === 'reptile' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {speciesInfo.category.charAt(0).toUpperCase() + speciesInfo.category.slice(1)}
                </span>
              </div>

              {/* About This Species */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                  About This Species
                </h3>
                <p className="text-gray-700 leading-relaxed">{speciesInfo.description}</p>
              </div>

              {/* Detailed Information Sections */}
              <div className="space-y-4">
                {speciesInfo.habitat && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">🌍</span>
                      Habitat
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{speciesInfo.habitat}</p>
                  </div>
                )}

                {speciesInfo.diet && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">🍃</span>
                      Diet
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{speciesInfo.diet}</p>
                  </div>
                )}

                {speciesInfo.behavior && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">🧠</span>
                      Behavior
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{speciesInfo.behavior}</p>
                  </div>
                )}

                {speciesInfo.conservation_status && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">🛡️</span>
                      Conservation Status
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{speciesInfo.conservation_status}</p>
                  </div>
                )}

                {speciesInfo.interesting_facts && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">⭐</span>
                      Interesting Facts
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{speciesInfo.interesting_facts}</p>
                  </div>
                )}
              </div>

              {/* Identification Notes */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Identification Notes
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">AI analysis provided</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-3" 
                  onClick={handleSaveToCollection}
                >
                  Save to Collection
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 shadow-lg shadow-emerald-600/25" 
                  onClick={handlePublish}
                >
                  Share Discovery
                </Button>
              </div>
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
