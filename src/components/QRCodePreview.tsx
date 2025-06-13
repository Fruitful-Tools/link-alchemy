
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import QRCode from "qrcode";

interface QRCodePreviewProps {
  text: string;
  size: number[];
  errorLevel: string;
  foreground: string;
  background: string;
  logoUrl: string;
}

const QRCodePreview = ({
  text,
  size,
  errorLevel,
  foreground,
  background,
  logoUrl,
}: QRCodePreviewProps) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const generateQRCode = async () => {
    try {
      if (!text.trim()) {
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
        };
        logo.src = logoUrl;
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

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast({
        title: "Error",
        description: t('qr.errors.generateFirst'),
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast({
      title: "Success",
      description: t('qr.success.downloaded'),
    });
  };

  useEffect(() => {
    if (text.trim()) {
      generateQRCode();
    }
  }, [text, size, errorLevel, foreground, background, logoUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('qr.preview')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm">
            <AspectRatio ratio={1} className="overflow-hidden">
              <canvas
                ref={canvasRef}
                className="border border-slate-200 rounded-lg shadow-sm w-full h-full object-contain max-w-full max-h-full"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </AspectRatio>
          </div>
        </div>

        <Button
          onClick={downloadQRCode}
          disabled={!text.trim()}
          className="w-full mt-4"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('qr.download')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodePreview;
