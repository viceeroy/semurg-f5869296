interface TrendingSpeciesProps {
  species: Array<{
    name: string;
    count: string;
  }>;
}

const TrendingSpecies = ({ species }: TrendingSpeciesProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Species</h2>
      <div className="space-y-3">
        {species.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/80 transition-colors duration-200 cursor-pointer"
          >
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.count}</p>
            </div>
            <div className="w-8 h-8 bg-nature-green/20 rounded-full flex items-center justify-center">
              <span className="text-nature-green font-bold text-sm">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSpecies;