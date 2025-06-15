import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Leaf, Globe, RefreshCw } from "lucide-react";

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
  },
  {
    title: "Honey Bee",
    fact: "A single bee colony can contain up to 60,000 bees, and they communicate through a complex dance language to share locations of flowers.",
    icon: <Leaf className="w-5 h-5 text-yellow-500" />
  },
  {
    title: "Emperor Penguin",
    fact: "Male emperor penguins incubate eggs on their feet for 64 days in -40°C weather while females hunt for food in the ocean.",
    icon: <Globe className="w-5 h-5 text-blue-600" />
  },
  {
    title: "Chameleon",
    fact: "Chameleons can move their eyes independently and have tongues that can extend twice their body length to catch prey.",
    icon: <Lightbulb className="w-5 h-5 text-green-600" />
  },
  {
    title: "Dolphin",
    fact: "Dolphins have names for each other - unique whistle signatures that they use to identify and call to specific individuals.",
    icon: <Globe className="w-5 h-5 text-cyan-500" />
  },
  {
    title: "Owl",
    fact: "Owls have asymmetrical ear openings that allow them to pinpoint the exact location of sounds in complete darkness.",
    icon: <Lightbulb className="w-5 h-5 text-amber-600" />
  }
];

const RightSidebar = ({ searchQuery, searchResults }: RightSidebarProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const handleMoreFacts = () => {
    setCurrentFactIndex((prev) => (prev + 1) % defaultFacts.length);
  };

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
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {searchQuery ? 'Search Results' : 'Discover Nature'}
        </h2>
        
        {searchQuery ? renderSearchFacts() : renderDefaultFacts()}
        
        {!searchQuery && (
          <Button 
            onClick={handleMoreFacts}
            variant="outline"
            className="w-full mt-4 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            More facts
          </Button>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;