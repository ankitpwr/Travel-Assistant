import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-bg text-center">
      <p className="font-display text-2xl font-semibold text-ink">Page not found</p>
      <p className="text-sm text-muted">This route doesn't exist.</p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-brass px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-105"
      >
        Back to chat
      </Link>
    </div>
  );
}
