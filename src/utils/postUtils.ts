export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "1 day ago";
  return date.toLocaleDateString();
};

export const handleShare = (speciesName: string, aiInfo: string, postId: string, onShare: (postId: string) => void) => {
  if (navigator.share) {
    navigator.share({
      title: `Check out this ${speciesName}`,
      text: aiInfo,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
  }
  onShare(postId);
};