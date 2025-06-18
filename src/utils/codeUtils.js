import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';
import JSZip from 'jszip';

export const formatCode = async (code, language) => {
  try {
    if (typeof code !== 'string') {
      console.warn('formatCode received non-string value:', code);
      return String(code || '');
    }

    switch (language) {
      case 'html':
        return await prettier.format(code, {
          parser: 'html',
          plugins: [parserHtml],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
        });
      case 'css':
        return await prettier.format(code, {
          parser: 'css',
          plugins: [parserCss],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
        });
      case 'javascript':
        return await prettier.format(code, {
          parser: 'babel',
          plugins: [parserBabel],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
          semi: true,
          singleQuote: true,
        });
      default:
        return code;
    }
  } catch (error) {
    console.error('Formatting error:', error);
    return code;
  }
};

export const generateShareableLink = (htmlCode, cssCode, jsCode) => {
  const codeData = {
    html: htmlCode,
    css: cssCode,
    js: jsCode,
  };
  const encodedData = btoa(JSON.stringify(codeData));
  return `${window.location.origin}?code=${encodedData}`;
};

export const generateEmbedCode = (htmlCode, cssCode, jsCode) => {
  const shareableLink = generateShareableLink(htmlCode, cssCode, jsCode);
  return `<iframe src="${shareableLink}" width="100%" height="500" frameborder="0"></iframe>`;
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
  a.download = 'code-editor-project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
