import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Sun,
  Moon,
  Play,
  Square,
  RotateCcw,
  Layout,
  Code2,
  Eye,
  Settings,
  Share2,
  Wand2,
  Download,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import LayoutSelector from "./LayoutSelector";
import TemplateSelector from "./TemplateSelector";
import ExportModal from "./ExportModal";
import { formatCode } from "../utils/codeUtils";

const CodeEditor = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [layout, setLayout] = useState("side-by-side");
  const [isPreviewRunning, setIsPreviewRunning] = useState(true);
  const [activeTab, setActiveTab] = useState("html");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Live Preview</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <script>console.log('HTML loaded');</script>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`body {
  font-family: sans-serif;
  background-color: #f0f0f0;
  padding: 2rem;
}`);

  // Optional: keep it empty or use a template function
  const [jsCode, setJsCode] = useState(`console.log('Hello from JS');`);

  const iframeRef = useRef(null);
  const { toast } = useToast();

  const updatePreview = () => {
    if (!iframeRef.current || !isPreviewRunning) return;
    const iframe = iframeRef.current;
    const document = iframe.contentDocument;
    if (!document) return;

    const fullCode = `
      ${htmlCode}
      <style>${cssCode}</style>
      <script>${jsCode}</script>
    `;
    document.open();
    document.write(fullCode);
    document.close();
  };

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode, isPreviewRunning]);

  const resetCode = () => {
    setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Preview</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>`);
    setCssCode(`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f0f0f0;
}`);
    setJsCode(`console.log('Hello World!');`);
    toast({
      title: "Code Reset",
      description: "All code has been reset to default template.",
    });
  };

  const shareCode = () => {
    const codeData = { html: htmlCode, css: cssCode, js: jsCode };
    const encodedData = btoa(JSON.stringify(codeData));
    const shareUrl = `${window.location.origin}?code=${encodedData}`;
    console.log("Share URL:", shareUrl);

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "Share URL has been copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Clipboard copy failed", err);
        toast({
          title: "Copy Failed",
          description: "Your browser blocked the clipboard action.",
          variant: "destructive",
        });
      });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: `${isDarkMode ? "Light" : "Dark"} Mode`,
      description: `Switched to ${isDarkMode ? "light" : "dark"} theme.`,
    });
  };

  const getCodeValue = (language) => {
    switch (language) {
      case "html":
        return htmlCode || "";
      case "css":
        return cssCode || "";
      case "javascript":
        return jsCode || "";
      default:
        return "";
    }
  };

  const setCodeValue = (language, value) => {
    const safeValue = typeof value === "string" ? value : String(value || "");
    switch (language) {
      case "html":
        setHtmlCode(safeValue);
        break;
      case "css":
        setCssCode(safeValue);
        break;
      case "javascript":
        setJsCode(safeValue);
        break;
    }
  };

  const formatCurrentCode = async () => {
    try {
      const currentCode = getCodeValue(activeTab);
      const formattedCode = await formatCode(currentCode, activeTab);
      setCodeValue(activeTab, formattedCode);
      toast({
        title: "Code Formatted",
        description: `${activeTab.toUpperCase()} code has been formatted with Prettier.`,
      });
    } catch (error) {
      console.error("Formatting error:", error);
      toast({
        title: "Formatting Error",
        description: "There was an error formatting your code.",
        variant: "destructive",
      });
    }
  };
  return (
    <div
      className={`h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b backdrop-blur-sm transition-colors duration-300 ${
          isDarkMode
            ? "bg-black/20 border-white/10"
            : "bg-white/20 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Code2
              className={`w-6 h-6 ${isDarkMode ? "text-purple-400" : "text-blue-600"}`}
            />
            <h1
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Code Editor
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <TemplateSelector
              onTemplateSelect={(template) => {
                setHtmlCode(template.html);
                setCssCode(template.css);
                setJsCode(template.js);
              }}
              isDarkMode={isDarkMode}
            />

            <LayoutSelector
              layout={layout}
              onLayoutChange={setLayout}
              isDarkMode={isDarkMode}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={formatCurrentCode}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Format
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetCode}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewRunning(!isPreviewRunning)}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {isPreviewRunning ? (
                <Square className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPreviewRunning ? "Stop" : "Run"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {layout === "preview-only" ? (
          <div className="w-full p-4">
            <Card
              className={`h-full overflow-hidden ${
                isDarkMode
                  ? "bg-black/30 border-white/10"
                  : "bg-white/50 border-gray-200"
              }`}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </Card>
          </div>
        ) : (
          <>
            <div
              className={`${
                layout === "side-by-side" ? "w-1/2" : "w-full"
              } p-4 overflow-hidden`}
            >
              <Card
                className={`h-full overflow-hidden ${
                  isDarkMode
                    ? "bg-black/30 border-white/10"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value)}
                  className="h-full flex flex-col"
                >
                  <TabsList
                    className={`grid w-full grid-cols-3 ${
                      isDarkMode
                        ? "bg-black/20 border-white/10"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    <TabsTrigger
                      value="html"
                      className={`${
                        isDarkMode
                          ? "data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-300"
                          : "data-[state=active]:bg-white data-[state=active]:text-gray-800 text-gray-600"
                      }`}
                    >
                      HTML
                    </TabsTrigger>
                    <TabsTrigger
                      value="css"
                      className={`${
                        isDarkMode
                          ? "data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-300"
                          : "data-[state=active]:bg-white data-[state=active]:text-gray-800 text-gray-600"
                      }`}
                    >
                      CSS
                    </TabsTrigger>
                    <TabsTrigger
                      value="javascript"
                      className={`${
                        isDarkMode
                          ? "data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-300"
                          : "data-[state=active]:bg-white data-[state=active]:text-gray-800 text-gray-600"
                      }`}
                    >
                      JavaScript
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="html" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="html"
                        value={htmlCode}
                        onChange={(value) => setHtmlCode(value || "")}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="css"
                        value={cssCode}
                        onChange={(value) => setCssCode(value || "")}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="javascript" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={jsCode}
                        onChange={(value) => setJsCode(value || "")}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            <div
              className={`${
                layout === "side-by-side" ? "w-1/2" : "w-full"
              } p-4`}
            >
              <Card
                className={`h-full overflow-hidden ${
                  isDarkMode
                    ? "bg-black/30 border-white/10"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div
                  className={`px-4 py-2 border-b flex items-center justify-between ${
                    isDarkMode ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Preview
                  </span>
                  <div
                    className={`flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">Live</span>
                  </div>
                </div>
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </Card>
            </div>
          </>
        )}
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        htmlCode={htmlCode}
        cssCode={cssCode}
        jsCode={jsCode}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default CodeEditor;
