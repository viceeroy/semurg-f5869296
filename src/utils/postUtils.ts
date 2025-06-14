export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "1 day ago";
  return date.toLocaleDateString();
};

export const handleShare = async (speciesName: string, aiInfo: string, postId: string, onShare: (postId: string) => void) => {
  const shareData = {
    title: `Check out this ${speciesName} on Semurg`,
    text: `${aiInfo.slice(0, 100)}${aiInfo.length > 100 ? '...' : ''}`,
    url: `${window.location.origin}/?post=${postId}`,
  };

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback to copying link
      await navigator.clipboard.writeText(shareData.url);
      // Show a toast or alert to inform user
      const event = new CustomEvent('share-fallback', { 
        detail: { message: 'Link copied to clipboard!' } 
      });
      window.dispatchEvent(event);
    }
    onShare(postId);
  } catch (error) {
    console.error('Error sharing:', error);
    // Fallback to clipboard if share fails
    try {
      await navigator.clipboard.writeText(shareData.url);
      const event = new CustomEvent('share-fallback', { 
        detail: { message: 'Link copied to clipboard!' } 
      });
      window.dispatchEvent(event);
      onShare(postId);
    } catch (clipboardError) {
      console.error('Clipboard also failed:', clipboardError);
    }
  }
};