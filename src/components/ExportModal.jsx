import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Download, Link, Code, Copy } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import {
  generateShareableLink,
  generateEmbedCode,
  downloadProject,
} from "../utils/codeUtils";

const ExportModal = ({
  isOpen,
  onClose,
  htmlCode,
  cssCode,
  jsCode,
  isDarkMode,
}) => {
  const [shareableLink, setShareableLink] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const { toast } = useToast();

  const handleGenerateLink = () => {
    const link = generateShareableLink(htmlCode, cssCode, jsCode);
    setShareableLink(link);
  };

  const handleGenerateEmbed = () => {
    const embed = generateEmbedCode(htmlCode, cssCode, jsCode);
    setEmbedCode(embed);
  };

  const handleDownload = async () => {
    try {
      await downloadProject(htmlCode, cssCode, jsCode);
      toast({
        title: "Download Started",
        description: "Your project is being downloaded as a ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your project.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl ${
          isDarkMode
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            Export Project
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="download" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-3 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <TabsTrigger
              value="download"
              className={`${
                isDarkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </TabsTrigger>
            <TabsTrigger
              value="share"
              className={`${
                isDarkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
              }`}
            >
              <Link className="w-4 h-4 mr-2" />
              Share
            </TabsTrigger>
            <TabsTrigger
              value="embed"
              className={`${
                isDarkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
              }`}
            >
              <Code className="w-4 h-4 mr-2" />
              Embed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="space-y-4">
            <div className="text-center space-y-4">
              <p
                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Download your project as a ZIP file containing HTML, CSS, and
                JavaScript files.
              </p>
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download ZIP
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <p
                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Generate a shareable link for your project.
              </p>
              <Button
                onClick={handleGenerateLink}
                variant="outline"
                className={`w-full ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Generate Share Link
              </Button>
              {shareableLink && (
                <div className="space-y-2">
                  <Textarea
                    value={shareableLink}
                    readOnly
                    className={`resize-none w-full overflow-x-auto break-words ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-300"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                    rows={3}
                  />

                  <Button
                    onClick={() => copyToClipboard(shareableLink, "Share link")}
                    variant="outline"
                    size="sm"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-4">
              <p
                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Generate embed code for your website or blog.
              </p>
              <Button
                onClick={handleGenerateEmbed}
                variant="outline"
                className={`w-full ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Generate Embed Code
              </Button>
              {embedCode && (
                <div className="space-y-2">
                  <Textarea
                    value={embedCode}
                    readOnly
                    className={`resize-none ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-300"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                    rows={3}
                  />
                  <Button
                    onClick={() => copyToClipboard(embedCode, "Embed code")}
                    variant="outline"
                    size="sm"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
