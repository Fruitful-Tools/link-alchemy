
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadProps {
  logoFile: File | null;
  logoUrl: string;
  onLogoUpload: (file: File, url: string) => void;
  onLogoRemove: () => void;
}

const LogoUpload = ({ logoFile, logoUrl, onLogoUpload, onLogoRemove }: LogoUploadProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

      const reader = new FileReader();
      reader.onload = (e) => {
        onLogoUpload(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onLogoRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
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
  );
};

export default LogoUpload;
