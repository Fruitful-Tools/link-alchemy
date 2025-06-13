
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const URLRedirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [status, setStatus] = useState<string>("Looking up your link...");
  const [foundUrl, setFoundUrl] = useState<any>(null);

  // Reversible URL decoding function
  const decodeUrl = (shortCode: string): { url: string; exp: number | null } | null => {
    try {
      // Restore base64 padding and characters
      let base64 = shortCode
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Add padding if needed
      while (base64.length % 4) {
        base64 += '=';
      }
      
      // Decode from base64
      const jsonString = decodeURIComponent(atob(base64));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error decoding short code:", error);
      return null;
    }
  };

  const updateClickCount = (shortCode: string) => {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (storedUrls) {
      try {
        const urls = JSON.parse(storedUrls);
        const urlIndex = urls.findIndex((url: any) => url.shortCode === shortCode);
        if (urlIndex !== -1) {
          urls[urlIndex].clicks = (urls[urlIndex].clicks || 0) + 1;
          localStorage.setItem('shortenedUrls', JSON.stringify(urls));
        }
      } catch (error) {
        console.error("Error updating click count:", error);
      }
    }
  };

  useEffect(() => {
    if (shortCode) {
      console.log("Attempting to redirect for short code:", shortCode);
      
      // First try to decode the URL directly from the short code
      const decodedData = decodeUrl(shortCode);
      
      if (decodedData) {
        console.log("Decoded data:", decodedData);
        
        // Check if URL is expired
        if (decodedData.exp && Date.now() / 1000 > decodedData.exp) {
          console.log("URL has expired");
          setStatus("This link has expired");
          return;
        }
        
        setFoundUrl({ originalUrl: decodedData.url });
        updateClickCount(shortCode);
        
        console.log("Redirecting to:", decodedData.url);
        setStatus("Redirecting now...");
        
        // Add a small delay to show the status, then redirect
        setTimeout(() => {
          window.location.href = decodedData.url;
        }, 1000);
        return;
      }
      
      // Fallback: check localStorage for custom aliases
      const storedUrls = localStorage.getItem('shortenedUrls');
      console.log("Checking localStorage for custom alias:", storedUrls);
      
      if (storedUrls) {
        try {
          const urls = JSON.parse(storedUrls);
          console.log("Parsed URLs:", urls);
          
          const foundUrl = urls.find((url: any) => url.shortCode === shortCode);
          console.log("Found URL in localStorage:", foundUrl);
          
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
          {foundUrl && (foundUrl.exp === null || foundUrl.exp === undefined || Date.now() / 1000 <= foundUrl.exp)
            ? "Redirecting..." 
            : "Link Issue"
          }
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {status}
        </p>
        {foundUrl && (
          <p className="text-sm text-gray-500 mb-4 break-all">
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
