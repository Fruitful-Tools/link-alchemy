
import { useState } from "react";
import { motion } from "framer-motion";
import QRCodeSettings from "./QRCodeSettings";
import QRCodePreview from "./QRCodePreview";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://example.com");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [size, setSize] = useState([350]);
  const [errorLevel, setErrorLevel] = useState("M");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");

  const handleLogoUpload = (file: File, url: string) => {
    setLogoFile(file);
    setLogoUrl(url);
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoUrl("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <QRCodeSettings
          text={text}
          onTextChange={setText}
          size={size}
          onSizeChange={setSize}
          errorLevel={errorLevel}
          onErrorLevelChange={setErrorLevel}
          foreground={foreground}
          onForegroundChange={setForeground}
          background={background}
          onBackgroundChange={setBackground}
          logoFile={logoFile}
          logoUrl={logoUrl}
          onLogoUpload={handleLogoUpload}
          onLogoRemove={handleLogoRemove}
        />
      </motion.div>

      {/* Preview Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <QRCodePreview
          text={text}
          size={size}
          errorLevel={errorLevel}
          foreground={foreground}
          background={background}
          logoUrl={logoUrl}
        />
      </motion.div>
    </div>
  );
};

export default QRCodeGenerator;
