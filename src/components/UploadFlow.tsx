
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UploadFlowHeader from "./upload/UploadFlowHeader";
import UploadStep from "./upload/UploadStep";
import ConfirmStep from "./upload/ConfirmStep";
import IdentifyingStep from "./upload/IdentifyingStep";
import ResultsStep from "./upload/ResultsStep";
import FailedStep from "./upload/FailedStep";
import PublishingStep from "./upload/PublishingStep";

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
  const [currentStep, setCurrentStep] = useState<"upload" | "confirm" | "identifying" | "results" | "failed" | "publishing">("upload");
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
        setCurrentStep("confirm");
      };
      reader.readAsDataURL(file);
    }
  };

  const identifySpecies = async () => {
    if (!selectedImage) return;
    
    setCurrentStep("identifying");
    
    try {
      const { data, error } = await supabase.functions.invoke('identify-species', {
        body: { imageUrl: selectedImage }
      });

      if (error) {
        setCurrentStep("failed");
        return;
      }

      if (data.success) {
        setSpeciesInfo(data.data);
        setCurrentStep("results");
      } else {
        setCurrentStep("failed");
      }
    } catch (error) {
      setCurrentStep("failed");
    }
  };

  const handleTryAgain = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setSpeciesInfo(null);
    setCurrentStep("upload");
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
          longitude: 0,
          is_private: false
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
          is_private: true
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
        <UploadFlowHeader currentStep={currentStep} onClose={onClose} />

        {currentStep === "upload" && (
          <UploadStep onImageUpload={handleImageUpload} />
        )}

        {currentStep === "confirm" && selectedImage && (
          <ConfirmStep
            selectedImage={selectedImage}
            onBackToUpload={() => setCurrentStep("upload")}
            onIdentifySpecies={identifySpecies}
          />
        )}

        {currentStep === "identifying" && selectedImage && (
          <IdentifyingStep selectedImage={selectedImage} />
        )}

        {currentStep === "results" && selectedImage && speciesInfo && (
          <ResultsStep
            selectedImage={selectedImage}
            speciesInfo={speciesInfo}
            onSaveToCollection={handleSaveToCollection}
            onPublish={handlePublish}
          />
        )}

        {currentStep === "failed" && (
          <FailedStep onTryAgain={handleTryAgain} />
        )}

        {currentStep === "publishing" && (
          <PublishingStep />
        )}
      </div>
    </div>
  );
};

export default UploadFlow;
