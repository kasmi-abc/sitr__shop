import Image from "next/image";
import { cn } from "./cn";

interface Props {
  title: string;
  author: string;
  hue: number;
  image?: string;
  className?: string;
  large?: boolean;
}

export default function BookCover({ title, author, hue, image, className, large }: Props) {
  if (image) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden rounded-md bg-cream-200 shadow-[8px_10px_24px_rgba(0,0,0,0.25)]",
          className
        )}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover"
          unoptimized={image.startsWith("data:")}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 w-[10px] bg-gradient-to-r from-black/40 via-white/15 to-transparent" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-md p-4 text-center shadow-[8px_10px_24px_rgba(0,0,0,0.25)]",
        className
      )}
      style={{
        background: `linear-gradient(150deg, hsl(${hue} 38% 26%) 0%, hsl(${hue} 45% 16%) 55%, hsl(${hue} 50% 10%) 100%)`,
      }}
    >
      {/* spine highlight */}
      <div className="pointer-events-none absolute inset-y-0 start-0 w-[10px] bg-gradient-to-r from-black/50 via-white/15 to-transparent" />
      {/* gold frame */}
      <div className="pointer-events-none absolute inset-2 rounded-sm border border-gold-400/70" />
      <div className="pointer-events-none absolute inset-3 rounded-[2px] border border-gold-400/30" />

      <div className="relative">
        <div className="mx-auto mb-2 h-px w-10 bg-gold-400/80" />
        <p className="text-[10px] tracking-widest text-gold-200/90">ستر شوب</p>
      </div>

      <div className="relative px-1">
        <h3
          className={`font-display font-bold leading-snug text-cream-50 ${large ? "text-2xl" : "text-base"}`}
        >
          {title}
        </h3>
        <div className="mx-auto my-2 h-px w-12 bg-gold-400/70" />
        <p className={`text-gold-100/90 ${large ? "text-base" : "text-xs"}`}>{author}</p>
      </div>

      <div className="relative">
        <p className="text-[10px] text-cream-50/60">للكتب الشرعية والقفازات</p>
      </div>
    </div>
  );
}
