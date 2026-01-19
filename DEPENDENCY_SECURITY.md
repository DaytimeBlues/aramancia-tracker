# Dependency Security

## Overview

This document tracks security vulnerabilities in project dependencies and mitigation strategies.

## Current Status

Last checked: January 2026

### Known Vulnerabilities

#### 1. tar Package (High Severity)
- **Package**: `tar` (<=7.5.2)
- **Vulnerability**: Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization
- **CVE**: GHSA-8qq5-rm4j-mr97
- **Affected Dependency Chain**: `@capacitor/cli` -> `tar`
- **Severity**: High
- **Status**: Awaiting upstream fix

**Mitigation**:
- This vulnerability affects the Capacitor CLI build tool, not runtime code
- The vulnerability requires malicious tar archives to be extracted
- Our build process doesn't extract untrusted tar archives
- Risk level: **Low** (development dependency only, controlled environment)
- Monitor for updates to `@capacitor/cli` that update the `tar` dependency

**Action Items**:
- [ ] Monitor @capacitor/cli releases for tar dependency update
- [ ] Consider alternative build tools if vulnerability persists
- [ ] Review build process to ensure no untrusted archives are processed

## Security Best Practices

### 1. Regular Audits
Run security audits regularly:
```bash
npm audit
```

### 2. Update Dependencies
Keep dependencies up-to-date:
```bash
# Check for outdated packages
npm outdated

# Update non-breaking changes
npm update

# Update all (requires testing)
npm upgrade
```

### 3. Review Before Installing
Before adding new dependencies:
```bash
# Check package reputation
npm view <package-name>

# Check for known vulnerabilities
npm audit
```

### 4. Lock File Integrity
- Always commit `package-lock.json`
- Use `npm ci` in CI/CD (not `npm install`)
- Review lock file changes in PRs

### 5. Dependency Policy
- Minimize dependencies (fewer = smaller attack surface)
- Prefer well-maintained packages (active commits, large community)
- Avoid packages with unresolved high/critical vulnerabilities
- Use exact versions for critical security dependencies

## CI/CD Integration

Security audit is integrated into CI pipeline (`.github/workflows/ci.yml`):
```yaml
- name: Security audit
  run: npm audit --audit-level=moderate
  continue-on-error: true
```

Set to `continue-on-error: true` to avoid blocking builds on known, low-risk issues. Review audit output regularly.

## Monitoring

### Automated
- GitHub Dependabot alerts (if enabled)
- CI/CD pipeline audit checks
- npm audit on every `npm install`

### Manual
- Monthly review of `npm audit` output
- Quarterly review of all dependencies
- Check changelogs for security-related updates

## Responding to Vulnerabilities

### Critical (CVSS >= 9.0)
1. Immediate review within 24 hours
2. Patch or mitigate within 48 hours
3. Deploy emergency release if needed

### High (CVSS 7.0-8.9)
1. Review within 7 days
2. Plan mitigation strategy
3. Include in next planned release

### Moderate (CVSS 4.0-6.9)
1. Review within 30 days
2. Include in quarterly updates
3. Document in this file

### Low (CVSS < 4.0)
1. Review quarterly
2. Update when convenient
3. Monitor for severity changes

## Exemptions

Document any accepted risks or exemptions:

### tar Package in @capacitor/cli
- **Date**: January 2026
- **Severity**: High
- **Reason**: Development dependency only, controlled environment, no untrusted archive extraction
- **Risk Level**: Low
- **Review Date**: March 2026
- **Owner**: Repository maintainer

## Resources

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub Advisory Database](https://github.com/advisories)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [Common Vulnerability Scoring System (CVSS)](https://www.first.org/cvss/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

## Contact

For security concerns related to dependencies, see [SECURITY.md](./SECURITY.md).

---

*This document should be reviewed quarterly or when significant dependency changes occur.*
