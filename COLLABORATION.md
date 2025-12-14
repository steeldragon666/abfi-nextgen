# ABFI Platform - Team Collaboration Guide

## Repository Setup

The ABFI platform code is now available on GitHub at:
**https://github.com/powerplantnrg/abfi-platform**

## Git Workflow for Team Members

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/powerplantnrg/abfi-platform.git
   cd abfi-platform
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if exists)
   - Contact the team lead for required API keys and database credentials
   - Required env vars are listed in `server/_core/env.ts`

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

### Daily Workflow

1. **Always pull latest changes before starting work:**
   ```bash
   git pull origin main
   ```

2. **Create a feature branch for your work:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes and commit frequently:**
   ```bash
   git add .
   git commit -m "Clear description of what changed"
   ```

4. **Push your branch to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request (PR) on GitHub:**
   - Go to https://github.com/powerplantnrg/abfi-platform
   - Click "Pull Requests" → "New Pull Request"
   - Select your branch and create the PR
   - Request review from team members

### Branch Naming Conventions

- **Features:** `feature/demand-signals-ui`, `feature/carbon-reporting`
- **Bug Fixes:** `fix/certificate-download-error`, `fix/bankability-calculation`
- **Improvements:** `improve/performance-optimization`, `improve/ui-responsiveness`
- **Documentation:** `docs/api-documentation`, `docs/setup-guide`

### Commit Message Guidelines

Write clear, descriptive commit messages:

**Good:**
- `Add supplier response submission form to demand signals`
- `Fix TypeScript error in bankability assessment router`
- `Update README with deployment instructions`

**Bad:**
- `Fixed stuff`
- `WIP`
- `Updates`

### Code Review Process

1. **Before requesting review:**
   - Ensure all TypeScript errors are resolved (`pnpm tsc --noEmit`)
   - Run tests if available (`pnpm test`)
   - Test your changes locally
   - Update `todo.md` to mark completed items

2. **Reviewing PRs:**
   - Check for code quality and consistency
   - Test the changes locally if possible
   - Provide constructive feedback
   - Approve when satisfied

3. **Merging:**
   - Only merge after approval from at least one team member
   - Use "Squash and merge" for cleaner history
   - Delete the feature branch after merging

## Project Structure

```
abfi-platform/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utilities and tRPC client
│   │   └── contexts/    # React contexts
│   └── public/          # Static assets
├── server/              # Backend tRPC server
│   ├── routers.ts       # Main tRPC router
│   ├── db.ts            # Database query helpers
│   ├── _core/           # Framework-level code (don't modify)
│   └── *.ts             # Feature-specific routers
├── drizzle/             # Database schema and migrations
│   └── schema.ts        # Database table definitions
├── shared/              # Shared types and constants
└── todo.md              # Project task tracking
```

## Development Guidelines

### Database Changes

1. **Update schema:**
   ```typescript
   // Edit drizzle/schema.ts
   export const newTable = mysqlTable('new_table', {
     id: int('id').primaryKey().autoincrement(),
     // ... fields
   });
   ```

2. **Generate and apply migration:**
   ```bash
   pnpm db:push
   ```

3. **Add database helpers in `server/db.ts`**

### Adding New Features

1. **Backend (tRPC):**
   - Add procedures to `server/routers.ts` or create a new router file
   - Use `protectedProcedure` for authenticated endpoints
   - Use `publicProcedure` for public endpoints

2. **Frontend:**
   - Create page components in `client/src/pages/`
   - Use shadcn/ui components from `@/components/ui/`
   - Call backend via `trpc.*.useQuery()` or `trpc.*.useMutation()`
   - Add routes in `client/src/App.tsx`

3. **Testing:**
   - Write vitest tests in `server/*.test.ts`
   - Run tests with `pnpm test`

### Code Style

- **TypeScript:** Strict mode enabled, no `any` types
- **React:** Functional components with hooks
- **Styling:** Tailwind CSS utilities + shadcn/ui components
- **Formatting:** Follow existing patterns in the codebase

## Conflict Resolution

If you encounter merge conflicts:

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Resolve conflicts manually:**
   - Open conflicted files
   - Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
   - Choose the correct code or merge both
   - Remove conflict markers

3. **Test after resolving:**
   ```bash
   pnpm dev  # Ensure server starts
   pnpm tsc --noEmit  # Check TypeScript
   ```

4. **Commit the resolution:**
   ```bash
   git add .
   git commit -m "Resolve merge conflicts in [file names]"
   ```

## Communication

- **Code Questions:** Use PR comments or team chat
- **Bug Reports:** Create GitHub Issues with reproduction steps
- **Feature Requests:** Discuss with team before implementing
- **Urgent Issues:** Tag team lead in Slack/Discord

## Deployment

The platform is deployed via Manus hosting:
- **Staging:** Automatic deployment from `main` branch
- **Production:** Manual deployment after checkpoint creation
- **Database:** Managed by Manus (connection string in env vars)

## Getting Help

- **Documentation:** Check `README.md` and template docs in `server/_core/`
- **Todo List:** See `todo.md` for current tasks and priorities
- **Team Lead:** Contact for access issues or major architectural questions

## Important Notes

- **Never commit `.env` files** - they contain secrets
- **Always test locally** before pushing
- **Keep PRs focused** - one feature/fix per PR
- **Update `todo.md`** when completing tasks
- **Write clear commit messages** for future reference

---

**Happy coding! 🚀**
