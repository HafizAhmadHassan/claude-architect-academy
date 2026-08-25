import Link from "next/link";
import { certification, siteMetadata } from "@/lib/content/certification";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-semibold">{siteMetadata.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            An independent educational preparation platform for the{" "}
            {certification.name} certification.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Learn</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-foreground" href="/roadmap">Study roadmap</Link></li>
            <li><Link className="hover:text-foreground" href="/domains">Five exam domains</Link></li>
            <li><Link className="hover:text-foreground" href="/practice">Practice questions</Link></li>
            <li><Link className="hover:text-foreground" href="/scenarios">Architecture scenarios</Link></li>
            <li><Link className="hover:text-foreground" href="/labs/mcp-server">MCP server lab</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Your Progress</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-foreground" href="/progress">Dashboard</Link></li>
            <li><Link className="hover:text-foreground" href="/bookmarks">Bookmarks</Link></li>
            <li><Link className="hover:text-foreground" href="/notes">My Notes</Link></li>
            <li><Link className="hover:text-foreground" href="/achievements">Achievements</Link></li>
            <li><Link className="hover:text-foreground" href="/search">Search</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Official Anthropic resources</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                className="hover:text-foreground"
                href={certification.officialUrls.certificationPage}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official certification page ↗
              </a>
            </li>
            <li>
              <a
                className="hover:text-foreground"
                href={certification.officialUrls.learn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Anthropic Learn ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted sm:px-6">
          Claude Architect Academy is not operated, owned, or endorsed by
          Anthropic. Anthropic is the certification issuer and the sole source
          of authoritative certification information. {certification.verifyNotice}{" "}
          Exam facts last verified {certification.lastVerified}.
        </p>
      </div>
    </footer>
  );
}
