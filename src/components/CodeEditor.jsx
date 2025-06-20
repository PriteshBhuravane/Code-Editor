import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sun,
  Moon,
  Play,
  Square,
  RotateCcw,
  Check,
  Layout,
  Code2,
  Eye,
  Settings,
  Share,
  Share2,
  Wand2,
  Download,
  Maximize,
  Undo,
  Redo,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LayoutSelector from "./LayoutSelector";
import TemplateSelector from "./TemplateSelector";
import ExportModal from "./ExportModal";
import PreviewErrorBoundary from "./PreviewErrorBoundary";
import { formatCode } from "@/utils/codeUtils";

const CodeEditor = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [layout, setLayout] = useState("side-by-side");
  const [isPreviewRunning, setIsPreviewRunning] = useState(true);
  const [activeTab, setActiveTab] = useState("html");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Code history for undo/redo functionality
  const [codeHistory, setCodeHistory] = useState({
    html: [],
    css: [],
    javascript: [],
  });

  const [historyIndex, setHistoryIndex] = useState({
    html: -1,
    css: -1,
    javascript: -1,
  });

  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Preview</title>
</head>
<body>
    <h1>Welcome to Code Editor</h1>
    <p>Start coding and see your changes live!</p>
    <button onclick="changeColor()">Click me!</button>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

button {
    padding: 12px 24px;
    font-size: 1rem;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 25px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}`);

  const [jsCode, setJsCode] = useState(`function changeColor() {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = randomColor;
}

console.log('Welcome to the Code Editor!');`);

  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const { toast } = useToast();

  // Initialize code history
  useEffect(() => {
    setCodeHistory({
      html: [htmlCode],
      css: [cssCode],
      javascript: [jsCode],
    });
    setHistoryIndex({
      html: 0,
      css: 0,
      javascript: 0,
    });
  }, []);

  const addToHistory = (language, code) => {
    setCodeHistory((prev) => {
      const newHistory = { ...prev };
      const currentHistory = [...newHistory[language]];
      const currentIndex = historyIndex[language];

      // Remove any future history if we're not at the end
      if (currentIndex < currentHistory.length - 1) {
        currentHistory.splice(currentIndex + 1);
      }

      // Add new code to history
      currentHistory.push(code);

      // Limit history to 50 entries
      if (currentHistory.length > 50) {
        currentHistory.shift();
      }

      newHistory[language] = currentHistory;
      return newHistory;
    });

    setHistoryIndex((prev) => ({
      ...prev,
      [language]: Math.min(codeHistory[language].length, 49),
    }));
  };

  const undo = () => {
    const currentIndex = historyIndex[activeTab];
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const previousCode = codeHistory[activeTab][newIndex];

      setHistoryIndex((prev) => ({
        ...prev,
        [activeTab]: newIndex,
      }));

      setCodeValue(activeTab, previousCode, false);
      toast({
        title: "Undo",
        description: "Reverted to previous code state.",
      });
    }
  };

  const redo = () => {
    const currentIndex = historyIndex[activeTab];
    if (currentIndex < codeHistory[activeTab].length - 1) {
      const newIndex = currentIndex + 1;
      const nextCode = codeHistory[activeTab][newIndex];

      setHistoryIndex((prev) => ({
        ...prev,
        [activeTab]: newIndex,
      }));

      setCodeValue(activeTab, nextCode, false);
      toast({
        title: "Redo",
        description: "Restored next code state.",
      });
    }
  };

  const openFindReplace = () => {
    if (editorRef.current) {
      editorRef.current.trigger("keyboard", "actions.find");
    }
  };

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

  const [copied, setCopied] = useState(false);

  const shareCode = () => {
    const codeData = { html: htmlCode, css: cssCode, js: jsCode };
    const encodedData = btoa(JSON.stringify(codeData));
    const shareUrl = `${window.location.origin}?code=${encodedData}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Share URL has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
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

  const setCodeValue = (language, value, addHistory = true) => {
    const safeValue = typeof value === "string" ? value : String(value || "");

    if (addHistory) {
      addToHistory(language, safeValue);
    }

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

  const handleLayoutChange = (newLayout) => {
    console.log("Layout changing from", layout, "to:", newLayout);
    setLayout(newLayout);

    // Force a re-render by updating preview after layout change
    setTimeout(() => {
      updatePreview();
    }, 100);

    toast({
      title: "Layout Changed",
      description: `Switched to ${newLayout.replace("-", " ")} layout.`,
    });
  };

  const exitFullscreen = () => {
    handleLayoutChange("side-by-side");
  };

  // Enhanced Monaco editor options
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    // Enhanced features
    folding: true,
    foldingStrategy: "auto",
    showFoldingControls: "always",
    wordWrap: "on",
    bracketPairColorization: { enabled: true },
    matchBrackets: "always",
    multiCursorModifier: "ctrlCmd",
    selectionHighlight: true,
    occurrencesHighlight: true,
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: "never",
      seedSearchStringFromSelection: "always",
    },
    // IntelliSense and auto-completion
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on",
    wordBasedSuggestions: true,
    // Additional features
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: true,
    renderWhitespace: "selection",
    renderControlCharacters: true,
    renderIndentGuides: true,
    highlightActiveIndentGuide: true,
    links: true,
    colorDecorators: true,
    lightbulb: { enabled: true },
    codeActions: { enabled: true },
    codeLens: true,
    formatOnPaste: true,
    formatOnType: true,
  };

  // Fullscreen layout - completely separate rendering
  if (layout === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={exitFullscreen}
            className="text-white hover:bg-white/10"
          >
            <Code2 className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
        <PreviewErrorBoundary>
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Fullscreen Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </PreviewErrorBoundary>
      </div>
    );
  }

  // Main application layout
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
              onLayoutChange={handleLayoutChange}
              isDarkMode={isDarkMode}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={openFindReplace}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Find
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex[activeTab] <= 0}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10 disabled:text-gray-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:text-gray-400"
              }`}
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={
                historyIndex[activeTab] >= codeHistory[activeTab].length - 1
              }
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10 disabled:text-gray-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:text-gray-400"
              }`}
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>

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
              onClick={shareCode}
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
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

      {/* Main Content Area - Dynamic based on layout */}
      <div className="flex-1 flex overflow-hidden">
        {layout === "preview-only" ? (
          /* Preview Only Layout */
          <div className="w-full p-4">
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
                  Preview Only Mode
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">Live</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLayoutChange("fullscreen")}
                    className={`p-1 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-white/10"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <PreviewErrorBoundary>
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </PreviewErrorBoundary>
            </Card>
          </div>
        ) : layout === "stacked" ? (
          /* Stacked Layout - Code Editor on top, Preview on bottom */
          <div className="w-full flex flex-col">
            {/* Code Editor - Top Half */}
            <div className="h-1/2 p-4 pb-2">
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
                        onChange={(value) => setCodeValue("html", value || "")}
                        onMount={(editor) => {
                          editorRef.current = editor;
                        }}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={editorOptions}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="css"
                        value={cssCode}
                        onChange={(value) => setCodeValue("css", value || "")}
                        onMount={(editor) => {
                          editorRef.current = editor;
                        }}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={editorOptions}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="javascript" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={jsCode}
                        onChange={(value) =>
                          setCodeValue("javascript", value || "")
                        }
                        onMount={(editor) => {
                          editorRef.current = editor;
                        }}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={editorOptions}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Preview - Bottom Half */}
            <div className="h-1/2 p-4 pt-2">
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
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Live</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLayoutChange("fullscreen")}
                      className={`p-1 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-white/10"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <PreviewErrorBoundary>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </PreviewErrorBoundary>
              </Card>
            </div>
          </div>
        ) : (
          /* Side-by-Side Layout (default) */
          <>
            {/* Code Editor - Left Side */}
            <div className="w-1/2 p-4 overflow-hidden">
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
                        onChange={(value) => setCodeValue("html", value || "")}
                        onMount={(editor) => {
                          editorRef.current = editor;
                        }}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={editorOptions}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="css"
                        value={cssCode}
                        onChange={(value) => setCodeValue("css", value || "")}
                        onMount={(editor) => {
                          editorRef.current = editor;
                        }}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={editorOptions}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="javascript" className="flex-1 mt-0">
                    <div className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={jsCode}
                        onChange={(value) =>
                          setCodeValue("javascript", value || "")
                        }
                        onMount={(editor) => {
                          editorRef.current = editor;
                        }}
                        theme={isDarkMode ? "vs-dark" : "light"}
                        options={editorOptions}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Preview - Right Side */}
            <div className="w-1/2 p-4">
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
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Live</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLayoutChange("fullscreen")}
                      className={`p-1 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-white/10"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <PreviewErrorBoundary>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </PreviewErrorBoundary>
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
