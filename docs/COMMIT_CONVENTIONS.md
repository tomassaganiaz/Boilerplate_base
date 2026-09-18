# Convenciones de Commits

Usamos Conventional Commits: `type(scope): descripción`

- **feat**: nueva funcionalidad (ej `feat(auth): refresh token`)
- **fix**: corrección de bug
- **docs**: solo documentación
- **refactor**: cambio interno sin afectar API
- **test**: añade o modifica tests
- **chore**: build, deps, CI

Ejemplos: `feat(db): añade migraciones`, `fix(validator): rechaza props desconocidas`

## Versionado
- SemVer `MAJOR.MINOR.PATCH`
- `feat` → MINOR, `fix` → PATCH, breaking `feat!` o `BREAKING CHANGE:` → MAJOR
- Tags: `git tag v1.2.0 && git push --tags`
- Changelog generado desde commits.

## Flujo
1. `git checkout -b feat/nueva`
2. `npm run lint && npm run typecheck && npm test`
3. `git commit -m "feat: ..."`
4. PR con plantilla `.github/pull_request_template.md`, requiere CI verde (lint, typecheck, coverage ≥80%).
