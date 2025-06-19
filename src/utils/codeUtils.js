// Add type declarations for CDN-loaded globals
const { prettier, prettierPlugins, JSZip } = window;

export const formatCode = (code, language) => {
  try {
    if (!code || typeof code !== 'string') return code || '';
    
    const baseOptions = {
      tabWidth: 2,
      useTabs: false,
      printWidth: 80,
      plugins: [
        prettierPlugins.html,
        prettierPlugins.postcss,
        prettierPlugins.babel
      ]
    };

    const options = {
      ...baseOptions,
      ...(language === 'javascript' ? {
        semi: true,
        singleQuote: true
      } : {})
    };

    return prettier.format(code, {
      ...options,
      parser: language === 'javascript' ? 'babel' : language
    });
    
  } catch (error) {
    console.error(`Error formatting ${language}:`, error);
    return code;
  }
};

export const downloadProject = async (htmlCode, cssCode, jsCode) => {
  const zip = new JSZip();
  zip.file('index.html', htmlCode);
  zip.file('styles.css', cssCode);
  zip.file('script.js', jsCode);
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.zip';
  a.click();
  URL.revokeObjectURL(url);
};
export const generateShareableLink = (htmlCode, cssCode, jsCode) => {
  try {
    const codeData = {
      html: htmlCode,
      css: cssCode,
      js: jsCode
    };
    // Compress the data more efficiently
    const encodedData = btoa(encodeURIComponent(JSON.stringify(codeData)));
    return `${window.location.origin}?code=${encodedData}`;
  } catch (error) {
    console.error("Error generating shareable link:", error);
    return "Error generating link";
  }
};

export const generateEmbedCode = (htmlCode, cssCode, jsCode) => {
  try {
    const shareableLink = generateShareableLink(htmlCode, cssCode, jsCode);
    return `<iframe src="${shareableLink}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
  } catch (error) {
    console.error("Error generating embed code:", error);
    return "Error generating embed code";
  }
};