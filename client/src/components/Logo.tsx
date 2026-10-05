/**
 * Site logo. Uses /logo.png (or .svg) from client/public when present;
 * until the file is added, shows the company name as a wordmark.
 */
import { useState } from "react";

const LOGO_SRC = "/logo.png";

export default function Logo({ light = false }: { light?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return <img src={LOGO_SRC} alt="Net Zero International" width={600} height={236} className="h-14 w-auto" onError={() => setFailed(true)} />;
  }
  return (
    <span className={`font-display font-bold text-[1.125rem] leading-none tracking-tight ${light ? "text-white" : "text-ink"}`}>
      net zero. <span className={light ? "text-white/70" : "text-accent"}>international</span>
    </span>
  );
}
