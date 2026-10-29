import { type ReactNode } from "react";
import { Calendar } from "lucide-react";

interface FormattedMessageProps {
  content: string;
  isUser: boolean;
  onBookClick?: () => void;
}

// Parses inline bold (**text**), italics (*text*), and links ([text](url))
function renderInline(text: string): ReactNode[] {
  // Split on bold **...**
  const boldParts = text.split(/\*\*(.+?)\*\*/g);

  return boldParts.map((part, i) => {
    // Odd index is bold text
    if (i % 2 === 1) {
      return (
        <strong key={`b-${i}`} className="font-bold text-zinc-900 font-sans">
          {part}
        </strong>
      );
    }

    // Even index: check for italic *...*
    const italicParts = part.split(/\*([^*]+)\*/g);
    return italicParts.map((subPart, j) => {
      if (j % 2 === 1) {
        return (
          <em key={`i-${i}-${j}`} className="italic">
            {subPart}
          </em>
        );
      }
      return subPart;
    });
  });
}

// Check if a line is a markdown table row (contains pipes)
function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|[\s-:]+(\|[\s-:]+)+\|$/.test(trimmed);
}

function parseTableCells(row: string): string[] {
  return row
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());
}

export default function FormattedMessage({
  content,
  isUser,
  onBookClick,
}: FormattedMessageProps) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  // Pre-process content: normalize line endings
  const rawLines = content.replace(/\r\n/g, "\n").split("\n");

  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Markdown Table parsing
    if (isTableRow(line) && i + 1 < rawLines.length && isTableSeparator(rawLines[i + 1])) {
      const headerCells = parseTableCells(line);
      i += 2; // skip header + separator line
      const dataRows: string[][] = [];

      while (i < rawLines.length && isTableRow(rawLines[i])) {
        if (!isTableSeparator(rawLines[i])) {
          dataRows.push(parseTableCells(rawLines[i]));
        }
        i++;
      }

      nodes.push(
        <div key={`table-${i}`} className="my-2.5 overflow-x-auto border border-stone-300 rounded bg-stone-50 text-xs">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-200/80">
              <tr>
                {headerCells.map((h, colIdx) => (
                  <th
                    key={colIdx}
                    className="px-2.5 py-1.5 text-left font-oswald uppercase tracking-wider font-bold text-zinc-900"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {dataRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-stone-50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2.5 py-1.5 text-zinc-800 font-serif">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 2. Headings (### or ## or #)
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h4 key={`h3-${i}`} className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm mt-3 mb-1">
          {renderInline(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h3 key={`h2-${i}`} className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-base mt-3 mb-1">
          {renderInline(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      i++;
      continue;
    }

    // 3. Bullet Lists (starts with • or - or * or numbered 1.)
    if (
      trimmed.startsWith("• ") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      /^\d+\.\s/.test(trimmed)
    ) {
      const listItems: string[] = [];
      const isNumbered = /^\d+\.\s/.test(trimmed);

      while (
        i < rawLines.length &&
        (rawLines[i].trim().startsWith("• ") ||
          rawLines[i].trim().startsWith("- ") ||
          rawLines[i].trim().startsWith("* ") ||
          /^\d+\.\s/.test(rawLines[i].trim()))
      ) {
        const itemText = rawLines[i]
          .trim()
          .replace(/^(•\s*|-\s*|\*\s*|\d+\.\s*)/, "");
        if (itemText) listItems.push(itemText);
        i++;
      }

      if (isNumbered) {
        nodes.push(
          <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 my-2 text-xs sm:text-sm font-serif">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        nodes.push(
          <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 my-2 text-xs sm:text-sm font-serif">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      continue;
    }

    // 4. Empty line / Paragraph separator
    if (!trimmed) {
      i++;
      continue;
    }

    // 5. Standard paragraph
    nodes.push(
      <p key={`p-${i}`} className="my-1.5 first:mt-0 last:mb-0 leading-relaxed font-serif">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  // Detect booking intent in content to surface interactive booking action
  const lowerContent = content.toLowerCase();
  const hasBookingIntent =
    lowerContent.includes("schedule") ||
    lowerContent.includes("appointment") ||
    lowerContent.includes("inspection") ||
    lowerContent.includes("reserve") ||
    lowerContent.includes("slot");

  return (
    <div className="space-y-1">
      {nodes}
      {hasBookingIntent && onBookClick && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onBookClick}
            className="inline-flex items-center gap-1.5 bg-crimson hover:bg-crimson-dark text-white px-3 py-1.5 text-xs font-oswald uppercase tracking-wider font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" /> Book Inspection Online
          </button>
        </div>
      )}
    </div>
  );
}
