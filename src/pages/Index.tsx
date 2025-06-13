
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Link, Sparkles } from "lucide-react";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import URLShortener from "@/components/URLShortener";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              LinkCraft
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Create stunning QR codes with custom logos and shorten URLs with expiration control
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="qrcode" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="qrcode" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code Generator
              </TabsTrigger>
              <TabsTrigger value="urlshortener" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                URL Shortener
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qrcode">
              <QRCodeGenerator />
            </TabsContent>

            <TabsContent value="urlshortener">
              <URLShortener />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 text-slate-500"
        >
          <p>Built with React, Tailwind CSS, and modern web technologies</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
