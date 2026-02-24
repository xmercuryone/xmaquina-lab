interface SectionHeadingProps {
  number: number;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ number, title, subtitle }: SectionHeadingProps) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div id={id} className="mb-10 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="text-brand font-medium text-sm tracking-widest">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="text-white text-3xl lg:text-4xl font-normal tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-body text-base lg:text-lg ml-10">{subtitle}</p>
      )}
      <div className="mt-4 h-px bg-stroke" />
    </div>
  );
}
