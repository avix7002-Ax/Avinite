import katex from 'katex';

export function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: '#ef4444',
      strict: false,
      trust: true,
    });
  } catch {
    return latex;
  }
}

export function renderInlineWithMath(text: string): React.ReactNode[] {
  // Handle $inline math$ and $$display math$$
  const parts: React.ReactNode[] = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\n$]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // Display math $$...$$
      parts.push(
        <span
          key={`math-d-${key++}`}
          className="block my-2 overflow-x-auto text-center"
          dangerouslySetInnerHTML={{ __html: renderMath(match[1], true) }}
        />
      );
    } else if (match[2] !== undefined) {
      // Inline math $...$
      parts.push(
        <span
          key={`math-i-${key++}`}
          dangerouslySetInnerHTML={{ __html: renderMath(match[2], false) }}
        />
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
