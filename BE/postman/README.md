# Postman setup for complete BE API testing

This folder contains ready-to-import Postman files for your backend.
The collection now includes all declared routes from your backend route files.

## Files

- `Simple-Quiz-BE.postman_collection.json`
- `Simple-Quiz-BE.postman_environment.json`

## Import steps

1. Open Postman.
2. Click Import.
3. Import both files from this folder.
4. Select environment: `Simple Quiz BE Local`.
5. Run request: `Auth -> Login (Auto Save Token)`.

After login succeeds:
- `token` is saved automatically from response body (`response.token`).
- `userId` is saved automatically from response body (`response.user.id`).

All protected requests in this collection use collection-level Bearer auth:
- Authorization: `Bearer {{token}}`

## Covered APIs

- `GET /`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /users`
- `GET /question`
- `GET /question/createdQuestions/:authorId`
- `GET /question/:questionId`
- `POST /question`
- `PUT /question/:questionId`
- `DELETE /question/:questionId`
- `DELETE /question` (deprecated, expected 405)
- `GET /quizzes`
- `GET /quizzes/:quizId`
- `GET /quizzes/:quizId/populate`
- `POST /quizzes`
- `PUT /quizzes/:quizId`
- `DELETE /quizzes/:quizId`
- `POST /quizzes/:quizId/question`
- `POST /quizzes/:quizId/questions`

## Suggested run order

1. Health
2. Auth -> Signup (or skip if user exists)
3. Auth -> Login (Auto Save Token)
4. Questions -> Create Question
5. Quizzes -> Create Quiz (Admin)
6. Run the rest using saved `questionId`, `quizId`, and `userId`

## Optional: Auto-clear stale token before login

If you want, add this Pre-request Script to the `Login (Auto Save Token)` request:

```javascript
pm.environment.unset('token');
pm.environment.unset('userId');
```

## Common issues

- 401 No token provided:
  - Ensure you ran `Login (Auto Save Token)` in the selected environment.
  - Ensure environment `Simple Quiz BE Local` is active.
- 403 not authorized:
  - Some routes need admin (`/users`, `POST /quizzes`, etc.).
- Wrong base URL:
  - Update `baseUrl` in environment if BE is not running on `http://localhost:3000`.
