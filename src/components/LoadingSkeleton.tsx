import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: "card" | "text" | "post" | "image";
}

const LoadingSkeleton = ({ 
  className, 
  lines = 3, 
  variant = "text" 
}: LoadingSkeletonProps) => {
  if (variant === "card") {
    return (
      <div className={cn("animate-pulse space-y-4 p-4 bg-white rounded-lg border", className)}>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex space-x-4">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (variant === "post") {
    return (
      <div className={cn("animate-pulse space-y-4 p-4 bg-white rounded-lg border", className)}>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 rounded",
            i === lines - 1 && "w-5/6",
            i === 0 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;