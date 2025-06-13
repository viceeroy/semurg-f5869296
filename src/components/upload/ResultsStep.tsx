import { Button } from "@/components/ui/button";
import SpeciesResultCard from "./SpeciesResultCard";

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

interface ResultsStepProps {
  selectedImage: string;
  speciesInfo: SpeciesInfo;
  onSaveToCollection: () => void;
  onPublish: () => void;
}

const ResultsStep = ({ selectedImage, speciesInfo, onSaveToCollection, onPublish }: ResultsStepProps) => {
  return (
    <div className="relative">
      <SpeciesResultCard selectedImage={selectedImage} speciesInfo={speciesInfo} />
      
      {/* Action Buttons */}
      <div className="flex gap-3 p-6 pt-2">
        <Button 
          variant="outline" 
          className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-3" 
          onClick={onSaveToCollection}
        >
          Save to Collection
        </Button>
        <Button 
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 shadow-lg shadow-emerald-600/25" 
          onClick={onPublish}
        >
          Share Discovery
        </Button>
      </div>
    </div>
  );
};

export default ResultsStep;