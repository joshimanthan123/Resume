# Practical 12: CI/CD Pipeline with GitHub Actions

![CI Pipeline](https://github.com/joshimanthan123/Resume/actions/workflows/ci.yml/badge.svg)

**Subject:** ITUE301 – Advanced Web Frameworks  
**Student:** Manthan Joshi  
**CO/PO:** CO5 / PO3, PO5

---

## Objective
Automate testing and deployment of the Task Management application using a GitHub Actions CI/CD pipeline that runs on every push to `main`.

## Architecture

```
git push origin main
        │
        ▼
GitHub Actions Trigger (on: push to main)
        │
        ▼
Job: build-and-test (ubuntu-latest, Node.js 18)
        ├── actions/checkout@v4          → Clone repository
        ├── actions/setup-node@v4        → Install Node.js 18
        ├── npm install                  → Install dependencies
        └── npm test                     → Run Jest test suite
                │
         ┌──────┴──────┐
         ▼             ▼
    ✅ PASS         ❌ FAIL
  Green ✓ on      Red ✗ on
   GitHub          GitHub
```

## Project Structure

```
Practical-12/
└── backend/
    ├── app.js              ← Express app (exported for testing)
    ├── server.js           ← Entry point (calls app.listen)
    ├── package.json        ← Jest + Supertest configured
    └── __tests__/
        └── tasks.test.js   ← Automated test suite (9 tests)

.github/
└── workflows/
    └── ci.yml              ← GitHub Actions workflow
```

## Automated Tests (Jest + Supertest)

| Test | Endpoint | Assertion |
|------|----------|-----------|
| Health check returns 200 | `GET /api/health` | `statusCode === 200` |
| Health status is "online" | `GET /api/health` | `body.status === 'online'` |
| Tasks list returns 200 | `GET /api/tasks` | `statusCode === 200` |
| Tasks response has data array | `GET /api/tasks` | `Array.isArray(body.data)` |
| At least one task returned | `GET /api/tasks` | `data.length > 0` |
| Create task returns 201 | `POST /api/tasks` | `statusCode === 201` |
| Missing title returns 400 | `POST /api/tasks` | `statusCode === 400` |
| Delete nonexistent returns 404 | `DELETE /api/tasks/:id` | `statusCode === 404` |
| Delete existing task returns 200 | `DELETE /api/tasks/:id` | `statusCode === 200` |

## Running Locally

```bash
cd Practical-12/backend
npm install
npm test
```

## CI/CD Demo Steps

### Step 1 – Passing Pipeline 🟢
All tests pass → GitHub shows green checkmark ✅

### Step 2 – Deliberately Broken Test 🔴
To demonstrate a failing pipeline, change the expected status code in `tasks.test.js`:
```js
// Broken: change 200 to 999
expect(res.statusCode).toBe(999);  // ← this will FAIL
```
Push → GitHub shows red X ❌

### Step 3 – Fixed Pipeline 🟢
Revert the change → Push → Green checkmark ✅

## Screenshots

> Screenshots of failed and passed pipeline runs are in the `docs/` folder.

| Run | Status | Description |
|-----|--------|-------------|
| Push 1 | ✅ Green | Initial passing pipeline |
| Push 2 | ❌ Red | Deliberately broken test (statusCode 999) |
| Push 3 | ✅ Green | Fixed — pipeline restored |

## Key Learnings

- **CI vs CD**: This practical demonstrates **Continuous Integration** (auto-run tests on push), not full Continuous Deployment (no server deploy step).
- **Why CI catches bugs early**: Every push is validated before it can reach others, reducing integration bugs.
- **Wrong test file path**: Would cause a "no tests found" error at the Jest step, different from a genuine assertion failure.

## Rubric Mapping

| Criteria | Implementation |
|----------|---------------|
| Workflow file (4 marks) | `.github/workflows/ci.yml` — valid YAML, triggers on push to main |
| Dependency install (3 marks) | `npm install` step in workflow |
| Automated test (5 marks) | 9 Jest tests via Supertest — pass/fail visible in Actions tab |
| Failed pipeline demo (4 marks) | Broken `statusCode` expectation → red X |
| Fixed pipeline demo (4 marks) | Reverted fix → green checkmark |
