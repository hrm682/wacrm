---
name: security-and-i18n-compliance
description: Ensures the application remains highly secure (no vulnerabilities, no SQL injection), mobile-responsive, and fully internationalized in all languages (ES, EN, PT, DE, FR, IT).
---

# Security & i18n Compliance Guidelines

This skill defines the critical review steps that the AI coding assistant must ALWAYS perform when modifying or creating code in this project.

## 1. Security & Hacking Prevention
- **Authentication & Authorization**: Verify that all API endpoints and database queries validate the user's session and permissions. Never trust client-provided IDs without verifying ownership.
- **Supabase RLS (Row Level Security)**: Ensure all tables have appropriate RLS policies enabled.
- **Cross-Site Scripting (XSS)**: Sanitize and escape any user inputs rendered dynamically. Do not bypass Next.js default sanitization unless absolutely necessary, and if so, sanitize explicitly.
- **Data Protection**: Prevent exposure of private API keys, user data, or system details.

## 2. SQL Injection Prevention
- **Parameterized Queries**: Never concatenate raw strings to build SQL queries. Always use parametrized bindings or database client wrappers (e.g. Supabase JS Client `.eq()`, `.filter()`).
- **Input Sanitization**: Ensure any variable used in query construction is validated and sanitized before execution.

## 3. Mobile Responsiveness
- **Layouts**: Use mobile-first design practices (`flex`, `grid`, and Tailwind's responsive prefixes like `sm:`, `md:`, `lg:`).
- **Interactive Elements**: Ensure buttons, dropdowns, and links have adequate touch targets (min 44x44px) and fit nicely on narrow viewports without causing overflow.

## 4. Multi-Language (i18n) Completeness
- **Zero Raw Strings**: Every user-facing label, title, placeholder, tooltip, or alert message must be fetched dynamically using the `t()` translator from `useLanguage()`.
- **Locale Syncing**: When adding a new key to `es.json`, it must also be added to `en.json`, `pt.json`, `de.json`, `fr.json`, and `it.json` with its corresponding translation.
- **Global Context**: Ensure translation states are preserved when navigating between tabs or subpages.
