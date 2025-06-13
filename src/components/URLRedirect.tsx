
import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

// This would typically come from a database or external storage
// For now, we'll use localStorage as a simple solution
const URLRedirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    if (shortCode) {
      console.log("Attempting to redirect for short code:", shortCode);
      
      // Get stored URLs from localStorage
      const storedUrls = localStorage.getItem('shortenedUrls');
      if (storedUrls) {
        const urls = JSON.parse(storedUrls);
        const foundUrl = urls.find((url: any) => url.shortCode === shortCode);
        
        if (foundUrl) {
          // Check if URL is expired
          if (foundUrl.expiresAt && new Date() > new Date(foundUrl.expiresAt)) {
            console.log("URL has expired");
            return;
          }
          
          // Increment click count
          foundUrl.clicks = (foundUrl.clicks || 0) + 1;
          localStorage.setItem('shortenedUrls', JSON.stringify(urls));
          
          console.log("Redirecting to:", foundUrl.originalUrl);
          // Redirect to the original URL
          window.location.href = foundUrl.originalUrl;
          return;
        }
      }
      
      console.log("Short code not found or expired");
    }
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-gray-600 mb-4">
          {shortCode ? "Looking up your link..." : "Invalid short code"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          If you are not redirected automatically, the link may be expired or invalid.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default URLRedirect;
