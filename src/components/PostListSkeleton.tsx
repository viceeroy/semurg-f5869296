import React from 'react';

const PostSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm mb-4 p-4 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    
    {/* Image skeleton */}
    <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
    
    {/* Content skeleton */}
    <div className="space-y-2 mb-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    
    {/* Actions skeleton */}
    <div className="flex items-center space-x-4">
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const PostListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
};

export default PostListSkeleton;