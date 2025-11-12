# Publishing Guide

This document outlines the steps to publish `bentogrid` to npm.

## Pre-Publishing Checklist

### ✅ Completed

- [x] Proper build configuration (TypeScript + Vite)
- [x] Dual format output (ESM + CommonJS)
- [x] TypeScript declarations (.d.ts files)
- [x] Package.json with proper exports
- [x] .npmignore file
- [x] LICENSE file
- [x] Comprehensive README
- [x] Basic test suite
- [x] Build scripts

### 🔲 Before Publishing

1. **Update package.json metadata:**
   - [ ] Add `author` field (or `authors` array)
   - [ ] Update `repository.url` with your GitHub repo URL
   - [ ] Update `bugs.url` with GitHub issues URL
   - [ ] Update `homepage` with GitHub repo URL or docs site

2. **Version management:**
   - [ ] Decide on version number (follow semver: MAJOR.MINOR.PATCH)
   - [ ] Update version in package.json
   - [ ] Consider creating a CHANGELOG.md

3. **Testing:**
   - [ ] Run `npm test` - all tests should pass
   - [ ] Test the built package locally:
     ```bash
     npm pack
     # Creates a .tgz file you can test
     ```

4. **Documentation:**
   - [ ] Review README for accuracy
   - [ ] Ensure all code examples work
   - [ ] Add any missing API documentation

5. **Code quality:**
   - [ ] Run linter (if configured)
   - [ ] Check for console.logs or debug code
   - [ ] Review error messages

6. **Security:**
   - [ ] Review dependencies for vulnerabilities: `npm audit`
   - [ ] Ensure no sensitive data in code

## Publishing Steps

### 1. Create npm Account

If you don't have one:
```bash
npm adduser
```

### 2. Login to npm

```bash
npm login
```

### 3. Verify Package Name Availability

The package name `bentogrid` must be available on npm. Check at:
https://www.npmjs.com/package/bentogrid

If taken, update `name` in package.json.

### 4. Build and Test

```bash
# Clean previous builds
rm -rf dist

# Build the library
npm run build

# Run tests
npm test

# Verify dist folder structure
ls -la dist/
# Should see: index.mjs, index.cjs, index.d.ts, and source maps
```

### 5. Dry Run (Recommended)

Test what would be published:
```bash
npm pack --dry-run
```

Or create a tarball to test locally:
```bash
npm pack
# Creates bentogrid-0.1.0.tgz
```

### 6. Publish

**For public package:**
```bash
npm publish
```

**For scoped package (if using @username/bentogrid):**
```bash
npm publish --access public
```

**For beta/alpha versions:**
```bash
npm publish --tag beta
# or
npm publish --tag alpha
```

### 7. Verify Publication

Check your package on npm:
https://www.npmjs.com/package/bentogrid

## Post-Publishing

1. **Create a Git tag:**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

2. **Create a GitHub release** (if using GitHub)

3. **Update documentation** with installation instructions

4. **Monitor for issues** and be ready to publish patches

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking API changes
- **MINOR** (0.2.0): New features, backward compatible
- **PATCH** (0.1.1): Bug fixes, backward compatible

## Updating the Package

1. Make changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build`
4. Test: `npm test`
5. Publish: `npm publish`

## Troubleshooting

### "Package name already taken"
- Choose a different name or use a scoped package: `@yourusername/bentogrid`

### "You must verify your email"
- Check your npm account email and verify it

### Build errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build:types`

### Tests failing
- Fix failing tests before publishing
- Consider adding more test coverage

## Best Practices

1. **Always test locally first** with `npm pack`
2. **Use semantic versioning** consistently
3. **Write clear commit messages** and changelog entries
4. **Keep dependencies minimal** - only what's needed
5. **Document breaking changes** clearly
6. **Respond to issues** promptly
7. **Consider CI/CD** for automated testing and publishing

