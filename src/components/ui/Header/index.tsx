import { BackButton } from '~/components/ui/BackButton';

interface HeaderProps {
  /** Page title */
  title: string;
  /** URL for back navigation (omit for no back button) */
  backTo?: string;
  /** Content to render on the right side of the header */
  rightContent?: React.ReactNode;
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Content rendered below the title row (e.g., progress bar) */
  children?: React.ReactNode;
  /** Navigation content rendered below the title area inside the header */
  nav?: React.ReactNode;
}

/**
 * A reusable header component with optional back button, title, and right content.
 */
export function Header({
  title,
  backTo,
  rightContent,
  subtitle,
  children,
  nav,
}: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-20 bg-surface shrink-0 shadow-md shadow-black/20 ${nav === undefined ? 'border-b border-surface-hover' : ''}`}
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className={`flex items-center gap-3 ${children ? 'mb-2' : ''}`}>
          {backTo && <BackButton to={backTo} />}
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
          </div>
          {rightContent}
        </div>
        {children}
      </div>
      {nav !== undefined && (
        <nav className="border-t border-surface-hover">
          <div className="max-w-md mx-auto flex">{nav}</div>
        </nav>
      )}
    </header>
  );
}
