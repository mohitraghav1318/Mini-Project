import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware versions of Link/useRouter/usePathname.
// Use these instead of next/link and next/navigation everywhere,
// so switching language doesn't break internal links.
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);