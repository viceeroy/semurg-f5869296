
import { Award } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Badge {
  id: string;
  name_en: string;
  name_uz: string;
  description_en: string;
  description_uz: string;
  icon_url?: string;
  earned_at?: string;
}

interface BadgeCardProps {
  badge: Badge;
  name: string;
  description: string;
}

const BadgeCard = ({ badge, name, description }: BadgeCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDetails(true)}
        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          {badge.icon_url ? (
            <img src={badge.icon_url} alt={name} className="w-8 h-8" />
          ) : (
            <Award className="w-6 h-6 text-white" />
          )}
        </div>
        <span className="text-xs font-medium text-gray-800 text-center">{name}</span>
      </button>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                {badge.icon_url ? (
                  <img src={badge.icon_url} alt={name} className="w-10 h-10" />
                ) : (
                  <Award className="w-8 h-8 text-white" />
                )}
              </div>
              <DialogTitle className="text-center">{name}</DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-center text-gray-600 mt-4">{description}</p>
          {badge.earned_at && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Earned: {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BadgeCard;
