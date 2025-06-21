
import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

interface Fact {
  title: string;
  fact: string;
  icon: string;
}

const facts: Fact[] = [
  {
    title: "Arctic Fox",
    fact: "Arctic foxes can survive temperatures as low as -70°C (-94°F) thanks to their incredibly thick fur and compact body shape.",
    icon: "🦊"
  },
  {
    title: "Blue Whale", 
    fact: "A blue whale's heart alone can weigh as much as an automobile, and its tongue can weigh as much as an elephant.",
    icon: "🐋"
  },
  {
    title: "Monarch Butterfly",
    fact: "Monarch butterflies migrate up to 3,000 miles, using a combination of air currents and thermals to travel efficiently.",
    icon: "🦋"
  },
  {
    title: "Octopus",
    fact: "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.",
    icon: "🐙"
  },
  {
    title: "Hummingbird",
    fact: "Hummingbirds are the only birds that can fly backwards and upside down, beating their wings up to 80 times per second.",
    icon: "🦜"
  }
];

const DidYouKnowFacts = () => {
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <span className="text-sm font-semibold text-emerald-700">Did You Know?</span>
      </div>
      <div className="transition-all duration-500 ease-in-out">
        <h3 className="font-semibold text-emerald-800 mb-1 flex items-center gap-2">
          <span className="text-lg">{facts[currentFact].icon}</span>
          {facts[currentFact].title}
        </h3>
        <p className="text-sm text-gray-700">{facts[currentFact].fact}</p>
      </div>
    </div>
  );
};

export default DidYouKnowFacts;
