
import { useState } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadFlowProps {
  onClose: () => void;
  onPostCreated?: () => void;
}

const UploadFlow = ({ onClose, onPostCreated }: UploadFlowProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<"upload" | "details" | "publishing">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setCurrentStep("details");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!user || !selectedFile || !title) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCurrentStep("publishing");

    try {
      // Upload image to Supabase Storage (for now we'll use the data URL)
      // In a real app, you'd upload to Supabase Storage and get a public URL
      
      // Create post in database
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title,
          description,
          image_url: selectedImage!, // In production, use actual uploaded image URL
          location_name: location,
          latitude: 0, // You could add geolocation here
          longitude: 0
        });

      if (error) {
        toast.error('Error creating post: ' + error.message);
        setCurrentStep("details");
        return;
      }

      toast.success('Post published successfully!');
      onPostCreated?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error('Error publishing post');
      setCurrentStep("details");
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <h3 className="text-lg font-semibold mb-2">Sign in required</h3>
          <p className="text-gray-600 mb-4">Please sign in to upload photos</p>
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
            {currentStep === "upload" && "Upload Photo"}
            {currentStep === "details" && "Add Details"}
            {currentStep === "publishing" && "Publishing..."}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Take or Upload a Photo</h3>
                  <p className="text-gray-600 text-sm">Capture wildlife and share your discovery</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="photo-upload">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose from Gallery
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

        {/* Details Step */}
        {currentStep === "details" && selectedImage && (
          <div className="p-6 space-y-6">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Species/Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., American Robin"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details about your wildlife discovery..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Central Park, NYC"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => setCurrentStep("upload")}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                onClick={handlePublish}
                disabled={!title}
              >
                Publish
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
            <h3 className="text-lg font-semibold text-gray-900">Publishing your discovery...</h3>
            <p className="text-gray-600">Sharing with the Semurg community</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFlow;
