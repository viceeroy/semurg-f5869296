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

interface SpeciesResultCardProps {
  selectedImage: string;
  speciesInfo: SpeciesInfo;
}

const SpeciesResultCard = ({ selectedImage, speciesInfo }: SpeciesResultCardProps) => {
  return (
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
      </div>
    </div>
  );
};

export default SpeciesResultCard;