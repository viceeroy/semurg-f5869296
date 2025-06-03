
import { Plus, Heart, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CollectionsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const collections = [
    {
      id: "1",
      title: "Backyard Birds",
      coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300",
      itemCount: 12,
      description: "Beautiful birds spotted in my garden",
      isPublic: true,
    },
    {
      id: "2",
      title: "Spring Flowers",
      coverImage: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300",
      itemCount: 8,
      description: "Wildflowers from hiking trails",
      isPublic: false,
    },
    {
      id: "3",
      title: "Urban Wildlife",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300",
      itemCount: 15,
      description: "Animals adapted to city life",
      isPublic: true,
    },
    {
      id: "4",
      title: "Butterflies & Moths",
      coverImage: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300",
      itemCount: 6,
      description: "Lepidoptera discoveries",
      isPublic: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
              </Button>
              <Button size="sm" className="nature-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Organize your wildlife discoveries</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-nature-green">{collections.length}</div>
            <div className="text-xs text-gray-600">Collections</div>
          </div>
          <div className="glass-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-nature-green">
              {collections.reduce((sum, col) => sum + col.itemCount, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="glass-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-nature-green">
              {collections.filter(col => col.isPublic).length}
            </div>
            <div className="text-xs text-gray-600">Public</div>
          </div>
        </div>

        {/* Collections Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={viewMode === "list" ? "w-20 h-20 flex-shrink-0" : "aspect-square"}>
                <img
                  src={collection.coverImage}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {collection.title}
                  </h3>
                  {!collection.isPublic && (
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 ml-1" />
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {collection.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {collection.itemCount} items
                  </span>
                  <Heart className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Collection CTA */}
        <div className="mt-8 text-center">
          <div className="glass-card rounded-xl p-6">
            <div className="w-12 h-12 bg-nature-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-nature-green" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Your First Collection</h3>
            <p className="text-sm text-gray-600 mb-4">
              Organize your wildlife discoveries into themed collections
            </p>
            <Button className="nature-gradient text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
