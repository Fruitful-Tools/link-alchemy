import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink, Clock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  expiresAt: Date | null;
  createdAt: Date;
  clicks: number;
}

const URLShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationValue, setExpirationValue] = useState("");
  const [expirationUnit, setExpirationUnit] = useState("never");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load URLs from localStorage on component mount
  useEffect(() => {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (storedUrls) {
      try {
        const urls = JSON.parse(storedUrls);
        // Convert date strings back to Date objects
        const urlsWithDates = urls.map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiresAt: url.expiresAt ? new Date(url.expiresAt) : null,
        }));
        setShortenedUrls(urlsWithDates);
      } catch (error) {
        console.error("Error loading URLs from localStorage:", error);
      }
    }
  }, []);

  // Save URLs to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const generateShortCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const calculateExpirationDate = () => {
    if (expirationUnit === "never") return null;
    
    const value = parseInt(expirationValue);
    if (!value || value <= 0) return null;

    const now = new Date();
    switch (expirationUnit) {
      case "minutes":
        return new Date(now.getTime() + value * 60 * 1000);
      case "hours":
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case "days":
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      case "weeks":
        return new Date(now.getTime() + value * 7 * 24 * 60 * 60 * 1000);
      case "months":
        return new Date(now.getTime() + value * 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    const shortCode = customAlias.trim() || generateShortCode();
    
    // Check if custom alias already exists
    if (customAlias.trim() && shortenedUrls.some(url => url.shortCode === shortCode)) {
      toast({
        title: "Error",
        description: "Custom alias already exists. Please choose a different one.",
        variant: "destructive",
      });
      return;
    }

    const expiresAt = calculateExpirationDate();
    const newUrl: ShortenedUrl = {
      id: Date.now().toString(),
      originalUrl,
      shortCode,
      expiresAt,
      createdAt: new Date(),
      clicks: 0,
    };

    setShortenedUrls(prev => [newUrl, ...prev]);
    setOriginalUrl("");
    setCustomAlias("");
    setExpirationValue("");
    setExpirationUnit("never");

    toast({
      title: "Success",
      description: "URL shortened successfully!",
    });
  };

  const copyToClipboard = async (url: ShortenedUrl) => {
    const shortUrl = `${window.location.origin}/${url.shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(url.id);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const isExpired = (url: ShortenedUrl) => {
    return url.expiresAt && new Date() > url.expiresAt;
  };

  const formatExpirationDate = (date: Date | null) => {
    if (!date) return "Never expires";
    return `Expires ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="space-y-8">
      {/* URL Shortening Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Shorten URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="originalUrl">Long URL</Label>
              <Input
                id="originalUrl"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
              <Input
                id="customAlias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                placeholder="my-custom-link"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label>Expiration (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  value={expirationValue}
                  onChange={(e) => setExpirationValue(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="1"
                  disabled={expirationUnit === "never"}
                  className="w-24"
                />
                <Select value={expirationUnit} onValueChange={setExpirationUnit}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never expire</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={shortenUrl} className="w-full">
              Shorten URL
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shortened URLs List */}
      {shortenedUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Shortened URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shortenedUrls.map((url) => (
                  <motion.div
                    key={url.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border rounded-lg p-4 ${
                      isExpired(url) ? "bg-red-50 border-red-200" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-lg font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {window.location.origin}/{url.shortCode}
                          </code>
                          {isExpired(url) && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              EXPIRED
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm truncate mb-1">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          {url.originalUrl}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Created: {url.createdAt.toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatExpirationDate(url.expiresAt)}
                          </span>
                          <span>Clicks: {url.clicks}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(url)}
                        disabled={isExpired(url)}
                      >
                        {copiedId === url.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default URLShortener;
