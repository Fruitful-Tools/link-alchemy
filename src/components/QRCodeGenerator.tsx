
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import QRCode from "qrcode";

const QRCodeGenerator = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("https://example.com");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [size, setSize] = useState([400]);
  const [errorLevel, setErrorLevel] = useState("M");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateQRCode = async () => {
    try {
      if (!text.trim()) {
        toast({
          title: "Error",
          description: t('qr.errors.emptyText'),
          variant: "destructive",
        });
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = size[0];
      canvas.height = size[0];

      // Generate QR code
      await QRCode.toCanvas(canvas, text, {
        width: size[0],
        margin: 2,
        color: {
          dark: foreground,
          light: background,
        },
        errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
      });

      // Add logo if uploaded
      if (logoUrl) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          const logoSize = size[0] * 0.2; // Logo is 20% of QR code size
          const x = (size[0] - logoSize) / 2;
          const y = (size[0] - logoSize) / 2;

          // Draw white background circle for logo
          ctx.fillStyle = background;
          ctx.beginPath();
          ctx.arc(size[0] / 2, size[0] / 2, logoSize / 2 + 10, 0, 2 * Math.PI);
          ctx.fill();

          // Draw logo
          ctx.drawImage(logo, x, y, logoSize, logoSize);
          
          // Update QR code URL
          setQrCodeUrl(canvas.toDataURL("image/png"));
        };
        logo.src = logoUrl;
      } else {
        setQrCodeUrl(canvas.toDataURL("image/png"));
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Error",
        description: t('qr.errors.generateFailed'),
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: t('qr.errors.fileTooLarge'),
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) {
      toast({
        title: "Error",
        description: t('qr.errors.generateFirst'),
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrCodeUrl;
    link.click();

    toast({
      title: "Success",
      description: t('qr.success.downloaded'),
    });
  };

  useEffect(() => {
    generateQRCode();
  }, [text, size, errorLevel, foreground, background, logoUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('qr.settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text">{t('qr.textUrl')}</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('qr.textUrlPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('qr.size')}: {size[0]}px</Label>
              <Slider
                value={size}
                onValueChange={setSize}
                max={800}
                min={200}
                step={50}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="errorLevel">{t('qr.errorLevel')}</Label>
              <Select value={errorLevel} onValueChange={setErrorLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">{t('qr.errorLevels.L')}</SelectItem>
                  <SelectItem value="M">{t('qr.errorLevels.M')}</SelectItem>
                  <SelectItem value="Q">{t('qr.errorLevels.Q')}</SelectItem>
                  <SelectItem value="H">{t('qr.errorLevels.H')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foreground">{t('qr.foregroundColor')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="foreground"
                    type="color"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">{t('qr.backgroundColor')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>{t('qr.logo')}</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('qr.uploadLogo')}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logoFile && (
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm text-slate-600 truncate">
                      {logoFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeLogo}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('qr.preview')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <AspectRatio ratio={1}>
                  <canvas
                    ref={canvasRef}
                    className="border border-slate-200 rounded-lg shadow-sm w-full h-full object-contain"
                  />
                </AspectRatio>
              </div>
            </div>

            <Button
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('qr.download')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QRCodeGenerator;
