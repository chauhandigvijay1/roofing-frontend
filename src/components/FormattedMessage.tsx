import { type ReactNode } from "react";
import { Calendar, ArrowRight, Calculator, Phone } from "lucide-react";

interface FormattedMessageProps {
  content: string;
  isUser: boolean;
  onBookClick?: () => void;
  onCalcClick?: () => void;
  brandPhone?: string;
  brandName?: string;
}

// Parses inline bold (**text**), italics (*text*), and links ([text](url))
function renderInline(text: string): ReactNode[] {
  // Strip any accidental markdown triple-backticks or raw artifacts
  const clean = text.replace(/```/g, "");

  // Split on bold **...**
  const boldParts = clean.split(/\*\*(.+?)\*\*/g);

  return boldParts.map((part, i) => {
    // Odd index is bold text
    if (i % 2 === 1) {
      return (
        <strong key={`b-${i}`} className="font-bold text-zinc-950 font-sans tracking-tight">
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
  onCalcClick,
  brandPhone,
  brandName,
}: FormattedMessageProps) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  // Strip action markers from the readable message
  const cleanContent = content.replace(/\[ACTION:(BOOK|CALC|CALL)\]/g, "").trim();

  // Pre-process content: normalize line endings
  const rawLines = cleanContent.replace(/\r\n/g, "\n").split("\n");

  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Markdown Table parsing -> Responsive Card / Table
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
        <div key={`table-${i}`} className="my-3 overflow-hidden border border-zinc-200 rounded-xl bg-stone-50/80 text-xs shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-100">
                <tr>
                  {headerCells.map((h, colIdx) => (
                    <th
                      key={colIdx}
                      className="px-3 py-2 text-left font-oswald uppercase tracking-wider font-bold text-zinc-900"
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {dataRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-stone-50/60 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-zinc-800 font-serif leading-snug">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1.5 my-2 text-xs sm:text-sm font-serif">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        nodes.push(
          <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1.5 my-2 text-xs sm:text-sm font-serif">
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

  // Detect action triggers and lead qualification states
  const lowerContent = content.toLowerCase();
  const isHandoff =
    content.includes("[ACTION:BOOK]") ||
    lowerContent.includes("priority scheduling") ||
    lowerContent.includes("unlocked priority") ||
    lowerContent.includes("conversion_handoff");

  const hasCalcAction = content.includes("[ACTION:CALC]");
  const hasCallAction = content.includes("[ACTION:CALL]") || (lowerContent.includes("active leak") && lowerContent.includes("call"));

  const hasBookingIntent =
    !isHandoff &&
    (lowerContent.includes("schedule") ||
      lowerContent.includes("appointment") ||
      lowerContent.includes("inspection") ||
      lowerContent.includes("reserve a slot"));

  return (
    <div className="space-y-2">
      {nodes}

      {/* 1. VIP Inspection Booking Action Card */}
      {(isHandoff || hasBookingIntent) && onBookClick && (
        <div className="mt-2.5 p-3.5 bg-stone-50 border border-crimson/30 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-oswald uppercase tracking-wider font-bold text-crimson">
            <Calendar className="w-3.5 h-3.5 text-crimson" /> Free 21-Point On-Site Inspection
          </div>
          <p className="text-xs text-zinc-600 font-serif leading-snug">
            Complimentary drone roof scan & forensic attic survey backed by {brandName || "our certified team"}. Zero deposit required.
          </p>
          <button
            type="button"
            onClick={onBookClick}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-crimson hover:bg-crimson-dark text-white py-2 px-3 rounded-lg text-xs font-oswald uppercase tracking-wider font-bold shadow-xs hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Select Priority Time Window</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. Instant Roof Calculator Action Card */}
      {hasCalcAction && onCalcClick && (
        <div className="mt-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
            <Calculator className="w-3.5 h-3.5 text-crimson" /> Instant Cost Modeling Studio
          </div>
          <p className="text-xs text-zinc-600 font-serif leading-snug">
            Slide to your approximate roof footprint to see live turnkey pricing for shingles, metal, or commercial TPO.
          </p>
          <button
            type="button"
            onClick={onCalcClick}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white py-2 px-3 rounded-lg text-xs font-oswald uppercase tracking-wider font-bold shadow-xs hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Calculator className="w-3 h-3" /> Launch Quick Calculator &rarr;
          </button>
        </div>
      )}

      {/* 3. Emergency Dispatch Hotline Action Card */}
      {hasCallAction && brandPhone && (
        <div className="mt-2.5 p-3.5 bg-red-50/80 border border-red-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-oswald uppercase tracking-wider font-bold text-red-900">
            <Phone className="w-3.5 h-3.5 text-red-600" /> Emergency Rapid Dispatch Hotline
          </div>
          <p className="text-xs text-zinc-700 font-serif leading-snug">
            Water dripping or severe storm breach? Our on-call superintendent provides immediate leak tarping & diagnostic response.
          </p>
          <a
            href={`tel:${brandPhone}`}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-xs font-oswald uppercase tracking-wider font-bold shadow-xs transition-all cursor-pointer"
          >
            <Phone className="w-3 h-3" /> Call Dispatch Desk: {brandPhone}
          </a>
        </div>
      )}
    </div>
  );
}
