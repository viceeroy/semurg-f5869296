import { useState, useEffect } from "react";
import { Camera, Upload, X, Loader2, Sparkles, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useImageOptimization } from "@/hooks/useImageOptimization";
import { usePerformance } from "@/hooks/usePerformance";

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
  const { language } = useLanguage();
  const { optimizeImage, isCompressing } = useImageOptimization();
  const { markStart, markEnd } = usePerformance();
  const [currentStep, setCurrentStep] = useState<"upload" | "confirm" | "identifying" | "results" | "failed" | "publishing">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [speciesInfo, setSpeciesInfo] = useState<SpeciesInfo | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      markStart('image_upload');
      
      try {
        const optimizedFile = await optimizeImage(file);
        console.log('Image optimized:', optimizedFile.size);
        processImage(optimizedFile);
      } catch (error) {
        console.error('Error optimizing image:', error);
        // Fallback to original file if optimization fails
        processImage(file);
      } finally {
        markEnd('image_upload');
      }
    }
  };

  const processImage = (file: File) => {
    console.log('Processing image:', file.name, file.size);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      console.log('Image converted to data URL, length:', imageDataUrl.length);
      setSelectedImage(imageDataUrl);
      setCurrentStep("confirm");
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  const handleTakePhoto = async () => {
    try {
      console.log('Taking photo with camera...');
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        console.log('Photo taken successfully');
        // Convert dataUrl to file
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
        processImage(file);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Failed to take photo');
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      console.log('Choosing photo from gallery...');
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (image.dataUrl) {
        console.log('Photo selected from gallery');
        // Convert dataUrl to file
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "gallery-photo.jpg", { type: "image/jpeg" });
        processImage(file);
      }
    } catch (error) {
      console.error('Error choosing from gallery:', error);
      toast.error('Failed to choose photo');
    }
  };

  const isMobile = Capacitor.isNativePlatform();

  const identifySpecies = async () => {
    if (!selectedImage) {
      console.error('No image selected for identification');
      return;
    }
    
    console.log('Starting species identification...');
    setCurrentStep("identifying");
    
    try {
      console.log('Calling identify-species function...');
      const { data, error } = await supabase.functions.invoke('identify-species', {
        body: { 
          imageUrl: selectedImage, 
          language: language === 'uz' ? 'uzbek' : 'english' 
        }
      });

      console.log('Species identification response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        setCurrentStep("failed");
        return;
      }

      if (data && data.success) {
        console.log('Species identified successfully:', data.data);
        setSpeciesInfo(data.data);
        setCurrentStep("results");
      } else {
        console.error('Species identification failed:', data);
        setCurrentStep("failed");
        if (data && data.error) {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.error('Error during species identification:', error);
      setCurrentStep("failed");
      toast.error('Failed to identify species');
    }
  };

  const handleTryAgain = () => {
    console.log('Trying again - resetting state');
    setSelectedImage(null);
    setSelectedFile(null);
    setSpeciesInfo(null);
    setCurrentStep("upload");
  };

  const handlePublish = async () => {
    if (!user || !selectedFile || !speciesInfo) {
      console.error('Missing required information for publishing');
      toast.error('Missing required information');
      return;
    }

    console.log('Publishing discovery...');
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
          longitude: 0,
          is_private: false,
          scientific_name: speciesInfo.scientific_name,
          category: speciesInfo.category,
          confidence: speciesInfo.confidence,
          habitat: speciesInfo.habitat,
          diet: speciesInfo.diet,
          behavior: speciesInfo.behavior,
          conservation_status: speciesInfo.conservation_status,
          interesting_facts: speciesInfo.interesting_facts,
          identification_notes: speciesInfo.identification_notes
        });

      if (error) {
        console.error('Error creating post:', error);
        toast.error('Error creating post: ' + error.message);
        setCurrentStep("results");
        return;
      }

      console.log('Discovery published successfully');
      toast.success('Discovery shared successfully!');
      onPostCreated?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error publishing discovery:', error);
      toast.error('Error publishing discovery');
      setCurrentStep("results");
    }
  };

  const handleSaveToCollection = async () => {
    if (!user || !speciesInfo || !selectedImage) {
      console.error('Missing information for saving to collection');
      toast.error('Please sign in to save discoveries');
      return;
    }

    console.log('Saving to collection...');

    try {
      // Create a private post for personal collection
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: speciesInfo.species_name,
          description: speciesInfo.description,
          image_url: selectedImage,
          location_name: '',
          latitude: 0,
          longitude: 0,
          is_private: true,
          scientific_name: speciesInfo.scientific_name,
          category: speciesInfo.category,
          confidence: speciesInfo.confidence,
          habitat: speciesInfo.habitat,
          diet: speciesInfo.diet,
          behavior: speciesInfo.behavior,
          conservation_status: speciesInfo.conservation_status,
          interesting_facts: speciesInfo.interesting_facts,
          identification_notes: speciesInfo.identification_notes
        })
        .select()
        .single();

      if (postError) {
        console.error('Error saving discovery:', postError);
        toast.error('Error saving discovery');
        return;
      }

      // Then save it to saved_posts
      const { error: saveError } = await supabase
        .from('saved_posts')
        .insert({ user_id: user.id, post_id: postData.id });

      if (saveError) {
        console.error('Error adding to saved collection:', saveError);
        toast.error('Error adding to saved collection');
        return;
      }

      console.log('Discovery saved to collection successfully');
      toast.success('Discovery saved to your collection!');
    } catch (error) {
      console.error('Error saving discovery:', error);
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
            {currentStep === "confirm" && "Ready to Identify"}
            {currentStep === "identifying" && "Analyzing..."}
            {currentStep === "results" && "Species Identified"}
            {currentStep === "failed" && "Identification Failed"}
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
                  <p className="text-gray-600 text-sm">Upload a photo and let AI identify the species in your preferred language</p>
                </div>
                
                {/* Mobile Camera Options */}
                {isMobile ? (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                      onClick={handleTakePhoto}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Picture
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50" 
                      onClick={handleChooseFromGallery}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Choose from Gallery
                    </Button>
                  </div>
                ) : (
                  /* Web File Upload */
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm Step */}
        {currentStep === "confirm" && selectedImage && (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <img
                src={selectedImage}
                alt="Selected photo"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Ready to analyze this photo?</h3>
                <p className="text-gray-600 text-sm">AI will identify the wildlife species in your image</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1 w-full" 
                onClick={() => setCurrentStep("upload")}
              >
                Choose Different Photo
              </Button>
              <Button 
                className="flex-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                onClick={identifySpecies}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Identify Species
              </Button>
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
                <p className="text-sm text-gray-700 leading-relaxed">{speciesInfo.identification_notes}</p>
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

        {/* Failed Step */}
        {currentStep === "failed" && (
          <div className="min-h-[500px] flex flex-col">
            {/* Full screen error display */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-50 to-orange-50">
              <div className="text-center space-y-6 max-w-sm">
                {/* Error Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-10 h-10 text-red-600" />
                </div>
                
                {/* Main Error Message */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Failed to identify species</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">Note:</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Take clear pictures of animals, birds, and plants. Upload again to Semurg for better identification results.
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-white/70 rounded-lg p-4 text-left space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Tips for better results:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Ensure good lighting</li>
                    <li>• Get close to the subject</li>
                    <li>• Avoid blurry images</li>
                    <li>• Include distinctive features</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Bottom Button */}
            <div className="p-6 bg-white border-t">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3" 
                onClick={handleTryAgain}
              >
                <Upload className="w-4 h-4 mr-2" />
                Try Again
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
