// Lightweight syntax highlighters for C and VBA code blocks
export function highlightCCode(code: string): string {
  const comments: string[] = [];
  let tempCode = code.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
    comments.push(match);
    return `___COMMENT_PLACEHOLDER_${comments.length - 1}___`;
  });

  const strings: string[] = [];
  tempCode = tempCode.replace(/(&quot;[\s\S]*?&quot;|"[\s\S]*?")/g, (match) => {
    strings.push(match);
    return `___STRING_PLACEHOLDER_${strings.length - 1}___`;
  });

  // Keywords — warm pumpkin amber (light theme)
  const keywords = /\b(int|void|return|if|else|while|for|struct|char|double|float|const|include|define)\b/g;
  tempCode = tempCode.replace(keywords, '<span class="text-amber-600 font-bold">$1</span>');

  // Functions — warm orange (light theme)
  tempCode = tempCode.replace(/\b(\w+)(?=\()/g, '<span class="text-orange-600">$1</span>');

  // Preprocessor directives — brand latte/rust
  tempCode = tempCode.replace(/(#[a-zA-Z]+)/g, '<span class="text-brand-orange font-semibold">$1</span>');

  // Restore Strings — warm yellow (light theme)
  tempCode = tempCode.replace(/___STRING_PLACEHOLDER_(\d+)___/g, (_, index) => {
    return `<span class="text-amber-700">${strings[parseInt(index, 10)]}</span>`;
  });

  // Restore Comments — muted warm gray
  tempCode = tempCode.replace(/___COMMENT_PLACEHOLDER_(\d+)___/g, (_, index) => {
    return `<span class="text-slate-500 italic">${comments[parseInt(index, 10)]}</span>`;
  });

  return tempCode;
}

export function highlightVbaCode(code: string): string {
  const comments: string[] = [];
  let tempCode = code.replace(/('[^\n]*)/g, (match) => {
    comments.push(match);
    return `___COMMENT_PLACEHOLDER_${comments.length - 1}___`;
  });

  const strings: string[] = [];
  tempCode = tempCode.replace(/(\"[\s\S]*?\")/g, (match) => {
    strings.push(match);
    return `___STRING_PLACEHOLDER_${strings.length - 1}___`;
  });

  // VBA Keywords — warm amber (light theme)
  const keywords = /\b(Sub|End Sub|Dim|As|For Each|In|Next|If|Then|Else|Do While|Loop|For|To|Step|MsgBox)\b/g;
  tempCode = tempCode.replace(keywords, '<span class="text-amber-600 font-bold">$1</span>');

  tempCode = tempCode.replace(/___STRING_PLACEHOLDER_(\d+)___/g, (_, index) => {
    return `<span class="text-amber-700">${strings[parseInt(index, 10)]}</span>`;
  });

  tempCode = tempCode.replace(/___COMMENT_PLACEHOLDER_(\d+)___/g, (_, index) => {
    return `<span class="text-slate-500 italic">${comments[parseInt(index, 10)]}</span>`;
  });

  return tempCode;
}

// Custom lightweight Markdown parser for premium styled output
export function parseMarkdown(md: string): string {
  if (!md) return '';
  
  // Basic HTML sanitization/escape to avoid breaking layout
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore allowed HTML tags like <img>, <iframe>, <video> that were escaped
  html = html.replace(/&lt;img\s+(.*?)\s*\/?&gt;/gi, '<img $1 />');
  html = html.replace(/&lt;iframe\s+(.*?)\s*&gt;&lt;\/iframe&gt;/gi, '<iframe $1></iframe>');
  html = html.replace(/&lt;video\s+(.*?)\s*&gt;&lt;\/video&gt;/gi, '<video $1></video>');
  
  // Restore allowed HTML table elements
  html = html.replace(/&lt;table(.*?)&gt;/gi, '<table$1>');
  html = html.replace(/&lt;\/table&gt;/gi, '</table>');
  html = html.replace(/&lt;thead(.*?)&gt;/gi, '<thead$1>');
  html = html.replace(/&lt;\/thead&gt;/gi, '</thead>');
  html = html.replace(/&lt;tbody(.*?)&gt;/gi, '<tbody$1>');
  html = html.replace(/&lt;\/tbody&gt;/gi, '</tbody>');
  html = html.replace(/&lt;tr(.*?)&gt;/gi, '<tr$1>');
  html = html.replace(/&lt;\/tr&gt;/gi, '</tr>');
  html = html.replace(/&lt;th(.*?)&gt;/gi, '<th$1>');
  html = html.replace(/&lt;\/th&gt;/gi, '</th>');
  html = html.replace(/&lt;td(.*?)&gt;/gi, '<td$1>');
  html = html.replace(/&lt;\/td&gt;/gi, '</td>');
  html = html.replace(/&lt;div(.*?)&gt;/gi, '<div$1>');
  html = html.replace(/&lt;\/div&gt;/gi, '</div>');
  
  // Fenced code blocks (MUST be before inline code!)
  html = html.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    let highlightedCode = code;
    const l = lang ? lang.toLowerCase() : '';
    if (l === 'c' || l === 'cpp') {
      highlightedCode = highlightCCode(code);
    } else if (l === 'vba') {
      highlightedCode = highlightVbaCode(code);
    }
    const badge = lang ? `<div class="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 select-none">${lang}</div>` : '';
    return `<pre class="bg-slate-50 text-slate-800 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4 border border-slate-200 shadow-inner">${badge}${highlightedCode}</pre>`;
  });

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="border-slate-200/80 my-8" />');

  // Blockquotes / Alerts
  html = html.replace(/^&gt;\s*\[!TIP\]\s*(.*$)/gim, '<div class="bg-emerald-50/60 border-l-4 border-emerald-500 p-4 my-4 rounded-r-xl text-sm text-emerald-800 font-medium">$1</div>');
  html = html.replace(/^&gt;\s*\[!IMPORTANT\]\s*(.*$)/gim, '<div class="bg-blue-50/60 border-l-4 border-blue-500 p-4 my-4 rounded-r-xl text-sm text-blue-800 font-medium">$1</div>');
  html = html.replace(/^&gt;\s*\[!WARNING\]\s*(.*$)/gim, '<div class="bg-amber-50/60 border-l-4 border-amber-500 p-4 my-4 rounded-r-xl text-sm text-amber-800 font-medium">$1</div>');
  html = html.replace(/^&gt;\s*(.*$)/gim, '<blockquote class="border-l-4 border-slate-300 bg-slate-50/50 px-4 py-2.5 my-4 text-sm text-slate-600 font-medium rounded-r-lg">$1</blockquote>');

  // Headings
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-xs font-bold text-slate-800 mt-3 mb-1">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-xs font-extrabold text-slate-800 mt-4 mb-1.5">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xs sm:text-sm font-black text-slate-800 mt-4 mb-2">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm sm:text-base font-extrabold text-slate-800 mt-5 mb-2 flex items-center gap-1.5">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base sm:text-lg font-black text-slate-900 mt-7 mb-3.5 border-b border-slate-100 pb-1.5 flex items-center gap-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl font-black text-slate-950 mt-2 mb-4">$1</h1>');


  // Markdown links -> HTML links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-500 font-bold underline inline-flex items-center gap-1 inline-block">$1 <span class="text-[10px] opacity-70">↗</span></a>');

  // Inline code (MUST be after fenced code blocks!)
  html = html.replace(/`(.*?)`/g, '<code class="bg-slate-100/80 text-slate-800 px-1.5 py-0.5 rounded-md font-mono text-xs border border-slate-200/50">$1</code>');

  // Markdown Tables
  const tableLines = html.split('\n');
  let inTable = false;
  let tableHeader = true;
  let bodyOpened = false;
  for (let i = 0; i < tableLines.length; i++) {
    const trimmed = tableLines[i].trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        tableLines[i] = '';
        tableHeader = false;
      } else {
        const cellTag = tableHeader ? 'th' : 'td';
        const rowClass = tableHeader ? 'bg-slate-100/50 border-b border-slate-200' : 'border-b border-slate-100 hover:bg-slate-50/50 transition-colors';
        const cellClass = tableHeader ? 'px-4 py-3 text-slate-700 font-semibold' : 'px-4 py-3 text-slate-650';
        const cellsHtml = cells.map(c => `<${cellTag} class="${cellClass}">${c}</${cellTag}>`).join('');
        
        let prefix = '';
        if (!inTable) {
          prefix = '<div class="overflow-x-auto my-6 border border-slate-200/80 rounded-xl shadow-xs"><table class="w-full text-left text-xs sm:text-sm border-collapse">\n' + (tableHeader ? '<thead>\n' : '<tbody>\n');
          if (!tableHeader) bodyOpened = true;
          inTable = true;
        } else if (!tableHeader && !bodyOpened) {
          prefix = '</thead>\n<tbody>\n';
          bodyOpened = true;
        }
        tableLines[i] = prefix + `<tr class="${rowClass}">${cellsHtml}</tr>`;
      }
    } else {
      if (inTable) {
        const suffix = (bodyOpened ? '</tbody>\n' : '</thead>\n') + '</table></div>\n';
        tableLines[i] = suffix + tableLines[i];
        inTable = false;
        tableHeader = true;
        bodyOpened = false;
      }
    }
  }
  if (inTable) {
    tableLines.push((bodyOpened ? '</tbody>\n' : '</thead>\n') + '</table></div>');
  }
  html = tableLines.join('\n');

  // Lists (with nesting support)
  const lines = html.split('\n');
  const listStack: number[] = [];
  let inPre = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<pre')) inPre = true;
    if (lines[i].includes('</pre>')) { inPre = false; continue; }
    
    const match = !inPre ? lines[i].match(/^(\s*)([*\-])\s+(.*)/) : null;
    if (match) {
      const indent = match[1].length;
      const content = match[3];
      
      let res = '';
      while (listStack.length > 0 && listStack[listStack.length - 1] > indent) {
        listStack.pop();
        res += '</ul>\n';
      }
      
      if (listStack.length === 0 || listStack[listStack.length - 1] < indent) {
        listStack.push(indent);
        res += `<ul class="list-disc list-inside space-y-1.5 my-2 text-slate-650 font-medium text-xs sm:text-sm ${listStack.length > 1 ? 'ml-5' : 'pl-2'}">\n`;
      }
      
      res += '<li class="pl-1">' + content + '</li>';
      lines[i] = res;
    } else {
      let res = '';
      while (listStack.length > 0) {
        listStack.pop();
        res += '</ul>\n';
      }
      if (res) {
        lines[i] = res + lines[i];
      }
    }
  }
  while (listStack.length > 0) {
    listStack.pop();
    lines.push('</ul>');
  }
  html = lines.join('\n');

  // Bold / Italic (Done after lists to prevent bullet asterisks from interfering with italic asterisks)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

  // Inject double newlines around block elements to ensure clean paragraph splitting
  html = html
    .replace(/(<(?:pre|ul|ol|h\d|div|blockquote|hr|table|img|iframe|video)[^>]*>)/gi, '\n\n$1')
    .replace(/(<\/(?:pre|ul|ol|h\d|div|blockquote|hr|table|img|iframe|video)>)/gi, '$1\n\n');

  // Paragraphs
  html = html.split(/\n\n+/).map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('<h') || 
      trimmed.startsWith('<ul') || 
      trimmed.startsWith('<pre') || 
      trimmed.startsWith('<div') || 
      trimmed.startsWith('</') || 
      trimmed.startsWith('<blockquote') || 
      trimmed.startsWith('<hr') || 
      trimmed.startsWith('<img') || 
      trimmed.startsWith('<iframe') || 
      trimmed.startsWith('<video') ||
      trimmed.startsWith('<table') ||
      trimmed.startsWith('<thead') ||
      trimmed.startsWith('<tbody') ||
      trimmed.startsWith('<tr') ||
      trimmed.startsWith('<th') ||
      trimmed.startsWith('<td')
    ) {
      return trimmed;
    }
    return `<p class="my-3 text-xs sm:text-sm md:text-base text-slate-650 font-medium leading-relaxed">${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}
