interface CodeBlockProps {
  code: string;
  label?: string;
}

export default function CodeBlock({ code, label }: CodeBlockProps) {
  return (
    <div className="rounded-lg border border-stroke overflow-hidden">
      {label && (
        <div className="px-4 py-2 bg-dark-gray border-b border-stroke text-xs text-body font-medium tracking-wide uppercase">
          {label}
        </div>
      )}
      <pre className="p-4 bg-[#0a0a0c] text-sm leading-relaxed overflow-x-auto text-body">
        <code>{code}</code>
      </pre>
    </div>
  );
}
