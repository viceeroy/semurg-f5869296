import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Leaf, Globe } from "lucide-react";

interface RightSidebarProps {
  searchQuery?: string;
  searchResults?: any[];
}

const defaultFacts = [
  {
    title: "Arctic Fox",
    fact: "Arctic foxes can survive temperatures as low as -70°C (-94°F) thanks to their incredibly thick fur and compact body shape.",
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />
  },
  {
    title: "Blue Whale",
    fact: "A blue whale's heart alone can weigh as much as an automobile, and its tongue can weigh as much as an elephant.",
    icon: <Globe className="w-5 h-5 text-blue-500" />
  },
  {
    title: "Monarch Butterfly",
    fact: "Monarch butterflies migrate up to 3,000 miles, using a combination of air currents and thermals to travel efficiently.",
    icon: <Leaf className="w-5 h-5 text-green-500" />
  },
  {
    title: "Octopus",
    fact: "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.",
    icon: <Globe className="w-5 h-5 text-purple-500" />
  },
  {
    title: "Hummingbird",
    fact: "Hummingbirds are the only birds that can fly backwards and upside down, beating their wings up to 80 times per second.",
    icon: <Lightbulb className="w-5 h-5 text-red-500" />
  }
];

const RightSidebar = ({ searchQuery, searchResults }: RightSidebarProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Rotate facts every 10 seconds
  useEffect(() => {
    if (!searchQuery) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % defaultFacts.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [searchQuery]);

  const renderSearchFacts = () => {
    if (!searchQuery) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Facts about "{searchQuery}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Searching for information about {searchQuery}...
            </p>
            <Badge variant="secondary" className="mb-2">
              Conservation Status: Varies by species
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Species</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Similar habitats</Badge>
              <Badge variant="outline">Related family</Badge>
              <Badge variant="outline">Same ecosystem</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDefaultFacts = () => {
    const currentFact = defaultFacts[currentFactIndex];
    
    return (
      <div className="space-y-4">
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {currentFact.icon}
              Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-emerald-700 mb-2">
              {currentFact.title}
            </h3>
            <p className="text-gray-600">{currentFact.fact}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Conservation Corner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Every species identification helps contribute to wildlife conservation efforts. 
              Your discoveries help scientists track biodiversity and ecosystem health.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Discoveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  🦅
                </div>
                <div>
                  <p className="font-medium">Golden Eagle</p>
                  <p className="text-sm text-gray-500">127 identifications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  🐋
                </div>
                <div>
                  <p className="font-medium">Humpback Whale</p>
                  <p className="text-sm text-gray-500">89 identifications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  🦋
                </div>
                <div>
                  <p className="font-medium">Monarch Butterfly</p>
                  <p className="text-sm text-gray-500">156 identifications</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {searchQuery ? 'Search Results' : 'Discover Nature'}
        </h2>
        
        {searchQuery ? renderSearchFacts() : renderDefaultFacts()}
      </div>
    </div>
  );
};

export default RightSidebar;