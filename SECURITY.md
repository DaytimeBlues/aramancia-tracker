# Security Policy

## Supported Versions

This project is currently in active development. Security updates are applied to the latest version only.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Security Measures

This project implements the following security best practices:

### 1. Content Security Policy (CSP)
- Strict CSP headers configured in `index.html` and `firebase.json`
- Prevents XSS attacks by controlling resource loading
- Restricts inline scripts and styles where possible

### 2. Security Headers
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer-Policy**: Limits referrer information leakage
- **Permissions-Policy**: Restricts access to browser features

### 3. Input Validation
- All numeric inputs are validated and bounded
- Type safety enforced through TypeScript
- Zod schemas used for runtime validation
- No use of `dangerouslySetInnerHTML` or `eval()`

### 4. Dependency Security
- Regular `npm audit` checks for known vulnerabilities
- Dependencies kept up-to-date
- CI/CD pipeline includes security scanning

### 5. Data Storage
- Client-side only (no backend/database)
- Data stored in browser's sessionStorage
- No sensitive data or PII collected
- No authentication or user accounts

### 6. HTTPS/Transport Security
- Deployed via Firebase Hosting with automatic HTTPS
- Preconnect with crossorigin for external fonts
- Subresource Integrity (SRI) where applicable

### 7. Code Quality
- ESLint with security-focused rules
- TypeScript strict mode enabled
- Code review process for all changes
- Automated testing with Vitest

## Known Security Considerations

### Current Limitations
1. **No Backend Authentication**: This is a client-side only PWA with no user accounts or server-side logic
2. **Local Storage**: All data is stored in browser's sessionStorage and can be accessed by the user
3. **CSP Unsafe Eval**: Required for React development and hot module replacement (production builds use stricter policies)

### Dependencies
- Regular monitoring via `npm audit`
- See `package.json` for full dependency list
- Known issues tracked in GitHub Issues

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Email the maintainer directly at: [Repository owner's contact] or create a private security advisory
3. Use GitHub's Security tab to report privately: https://github.com/DaytimeBlues/aramancia-tracker/security/advisories/new

### What to Include

Please include the following in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

### Disclosure Policy

- Please allow reasonable time for a fix before public disclosure
- We will credit researchers who responsibly disclose vulnerabilities (unless you prefer to remain anonymous)
- We will publish a security advisory once a fix is deployed

## Security Checklist for Contributors

When contributing to this project, please ensure:

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Input validation for all user inputs
- [ ] No use of `dangerouslySetInnerHTML`, `eval()`, or `Function()` constructors
- [ ] Dependencies checked with `npm audit`
- [ ] TypeScript types used (no `any` without justification)
- [ ] XSS vulnerabilities considered
- [ ] CSRF not applicable (no backend)
- [ ] Error messages don't leak sensitive information
- [ ] No SQL injection (not applicable - no database)
- [ ] Tests include security-relevant edge cases

## Security Tools & Commands

```bash
# Check for dependency vulnerabilities
npm audit

# Fix automatically fixable vulnerabilities (review changes carefully)
npm audit fix

# Run linter (includes security rules)
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests
npm test
```

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Security Updates

This document is reviewed and updated regularly. Last updated: January 2026

---

*For general questions or non-security issues, please use GitHub Issues or Discussions.*
