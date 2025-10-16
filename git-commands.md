# Git Commands for Vue3 Shipping Dashboard

## Initial Setup (if not already done)

```bash
# Initialize git repository
git init

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/yourusername/shipping-dashboard.git

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Vue3 Shipping Dashboard with API integration"

# Push to main branch
git push -u origin main
```

## Daily Development Workflow

### 1. Check Status
```bash
git status
```

### 2. Add Changes
```bash
# Add specific files
git add src/components/NewComponent.vue
git add src/views/Dashboard.vue

# Add all changes
git add .

# Add only tracked files (not new files)
git add -u
```

### 3. Commit Changes
```bash
# Commit with message
git commit -m "Add new dashboard component with API integration"

# Commit with detailed message
git commit -m "feat: Add TopCitiesTable component

- Implement table view for top cities data
- Add percentage calculations
- Include responsive design
- Connect to production API"
```

### 4. Push Changes
```bash
# Push to current branch
git push

# Push to specific branch
git push origin feature-branch
```

## Branch Management

### Create and Switch to New Branch
```bash
# Create and switch to new feature branch
git checkout -b feature/new-component

# Or using newer syntax
git switch -c feature/new-component
```

### Switch Between Branches
```bash
# Switch to main branch
git checkout main
git switch main

# Switch to existing branch
git checkout feature-branch
git switch feature-branch
```

### Merge Branches
```bash
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature/new-component

# Delete feature branch after merge
git branch -d feature/new-component
```

## Useful Git Commands

### View History
```bash
# View commit history
git log --oneline

# View detailed history
git log --graph --pretty=format:'%h -%d %s (%cr) <%an>' --abbrev-commit

# View changes in last commit
git show
```

### Undo Changes
```bash
# Undo changes to specific file
git checkout -- src/components/Component.vue

# Undo all changes
git checkout -- .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Stash Changes
```bash
# Stash current changes
git stash

# Stash with message
git stash save "Work in progress on dashboard"

# List stashes
git stash list

# Apply last stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

## Deployment Workflow

### 1. Build for Production
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### 2. Deploy to GitHub Pages (if using)
```bash
# Build and deploy
npm run build
git add dist/
git commit -m "Deploy to production"
git subtree push --prefix dist origin gh-pages
```

### 3. Deploy to Netlify/Vercel
```bash
# Build command: npm run build
# Publish directory: dist
# (Configure in deployment platform)
```

## Common Issues and Solutions

### 1. Node Modules Issues
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 2. Git Ignore Not Working
```bash
# Remove files from git cache
git rm -r --cached node_modules/
git rm -r --cached dist/
git add .gitignore
git commit -m "Update .gitignore"
```

### 3. Merge Conflicts
```bash
# View conflicted files
git status

# Edit files to resolve conflicts
# Then add resolved files
git add resolved-file.vue

# Complete merge
git commit
```

## Recommended Commit Messages

Use conventional commit format:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code formatting changes
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
```

Examples:
- `feat: Add TopCitiesTable component with API integration`
- `fix: Resolve API timeout issues in production`
- `docs: Update README with deployment instructions`
- `style: Format code with Prettier`
- `refactor: Extract API configuration to separate file`

## Pre-commit Checklist

Before committing, ensure:

- [ ] Code is formatted and linted
- [ ] No console.log statements in production code
- [ ] All imports are properly organized
- [ ] Components are properly documented
- [ ] API endpoints are working
- [ ] No sensitive data (API keys, passwords) in code
- [ ] .gitignore is up to date
- [ ] Build passes without errors

## Useful Git Aliases

Add to your `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    lg = log --graph --pretty=format:'%h -%d %s (%cr) <%an>' --abbrev-commit
```
