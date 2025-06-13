
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LogoUpload from "./LogoUpload";

interface QRCodeSettingsProps {
  text: string;
  onTextChange: (text: string) => void;
  size: number[];
  onSizeChange: (size: number[]) => void;
  errorLevel: string;
  onErrorLevelChange: (level: string) => void;
  foreground: string;
  onForegroundChange: (color: string) => void;
  background: string;
  onBackgroundChange: (color: string) => void;
  logoFile: File | null;
  logoUrl: string;
  onLogoUpload: (file: File, url: string) => void;
  onLogoRemove: () => void;
}

const QRCodeSettings = ({
  text,
  onTextChange,
  size,
  onSizeChange,
  errorLevel,
  onErrorLevelChange,
  foreground,
  onForegroundChange,
  background,
  onBackgroundChange,
  logoFile,
  logoUrl,
  onLogoUpload,
  onLogoRemove,
}: QRCodeSettingsProps) => {
  const { t } = useTranslation();

  return (
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
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={t('qr.textUrlPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('qr.size')}: {size[0]}px</Label>
          <Slider
            value={size}
            onValueChange={onSizeChange}
            max={800}
            min={200}
            step={50}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="errorLevel">{t('qr.errorLevel')}</Label>
          <Select value={errorLevel} onValueChange={onErrorLevelChange}>
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
                onChange={(e) => onForegroundChange(e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={foreground}
                onChange={(e) => onForegroundChange(e.target.value)}
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
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <LogoUpload
          logoFile={logoFile}
          logoUrl={logoUrl}
          onLogoUpload={onLogoUpload}
          onLogoRemove={onLogoRemove}
        />
      </CardContent>
    </Card>
  );
};

export default QRCodeSettings;
