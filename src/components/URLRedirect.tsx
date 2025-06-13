
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// This would typically come from a database or external storage
// For now, we'll use localStorage as a simple solution
const URLRedirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [status, setStatus] = useState<string>("Looking up your link...");
  const [foundUrl, setFoundUrl] = useState<any>(null);

  useEffect(() => {
    if (shortCode) {
      console.log("Attempting to redirect for short code:", shortCode);
      
      // Get stored URLs from localStorage
      const storedUrls = localStorage.getItem('shortenedUrls');
      console.log("Stored URLs:", storedUrls);
      
      if (storedUrls) {
        try {
          const urls = JSON.parse(storedUrls);
          console.log("Parsed URLs:", urls);
          
          const foundUrl = urls.find((url: any) => url.shortCode === shortCode);
          console.log("Found URL:", foundUrl);
          
          if (foundUrl) {
            setFoundUrl(foundUrl);
            
            // Check if URL is expired
            if (foundUrl.expiresAt && new Date() > new Date(foundUrl.expiresAt)) {
              console.log("URL has expired");
              setStatus("This link has expired");
              return;
            }
            
            // Increment click count
            foundUrl.clicks = (foundUrl.clicks || 0) + 1;
            localStorage.setItem('shortenedUrls', JSON.stringify(urls));
            
            console.log("Redirecting to:", foundUrl.originalUrl);
            setStatus("Redirecting now...");
            
            // Add a small delay to show the status, then redirect
            setTimeout(() => {
              window.location.href = foundUrl.originalUrl;
            }, 1000);
            return;
          }
        } catch (error) {
          console.error("Error parsing stored URLs:", error);
          setStatus("Error processing link");
          return;
        }
      }
      
      console.log("Short code not found");
      setStatus("Link not found or may have expired");
    } else {
      setStatus("Invalid short code");
    }
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          {foundUrl && !foundUrl.expiresAt || (foundUrl?.expiresAt && new Date() <= new Date(foundUrl.expiresAt)) 
            ? "Redirecting..." 
            : "Link Issue"
          }
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {status}
        </p>
        {foundUrl && (
          <p className="text-sm text-gray-500 mb-4">
            Destination: {foundUrl.originalUrl}
          </p>
        )}
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
