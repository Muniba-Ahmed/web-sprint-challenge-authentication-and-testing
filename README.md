# Authentication and Testing Sprint Challenge

**Read these instructions carefully. Understand exactly what is expected _before_ starting this Sprint Challenge.**

This challenge allows you to practice the concepts and techniques learned over the past sprint and apply them in a concrete project. This sprint explored **Authentication and Testing**. During this sprint, you studied **authentication, JSON web tokens, unit testing, and backend testing**. In your challenge this week, you will demonstrate your mastery of these skills by creating **a dad jokes app**.

This is an individual assessment. All work must be your own. All projects will be submitted to Codegrade for automated review. You will also be given feedback by code reviewers on Monday following the challenge submission. For more information on the review process [click here.](https://www.notion.so/bloomtech/How-to-View-Feedback-in-CodeGrade-c5147cee220c4044a25de28bcb6bb54a)

You are not allowed to collaborate during the sprint challenge.

## Project Setup

- [ ] Run `npm install` to install your dependencies.
- [ ] Build your database executing `npm run migrate`.
- [ ] Run tests locally executing `npm test`.

## Project Instructions

Dad jokes are all the rage these days! In this challenge, you will build a real wise-guy application.

Users must be able to call the `[POST] /api/auth/register` endpoint to create a new account, and the `[POST] /api/auth/login` endpoint to get a token.

We also need to make sure nobody without the token can call `[GET] /api/jokes` and gain access to our dad jokes.

We will hash the user's password using `bcryptjs`, and use JSON Web Tokens and the `jsonwebtoken` library.

### MVP

Your finished project must include all of the following requirements (further instructions are found inside each file):

- [ ] An authentication workflow with functionality for account creation and login, implemented inside `api/auth/auth-router.js`.
- [ ] Middleware used to restrict access to resources from non-authenticated requests, implemented inside `api/middleware/restricted.js`.
- [ ] A minimum of 2 tests per API endpoint, written inside `api/server.test.js`.

**IMPORTANT Notes:**

- Do not exceed 2^8 rounds of hashing with `bcryptjs`.
- If you use environment variables make sure to provide fallbacks in the code (e.g. `process.env.SECRET || "shh"`).
- You are welcome to create additional files but **do not move or rename existing files** or folders.
- Do not alter your `package.json` file except to install extra libraries. Do not update existing packages.
- The database already has the `users` table, but if you run into issues, the migration is available.
- In your solution, it is essential that you follow best practices and produce clean and professional results.
- Schedule time to review, refine, and assess your work and perform basic professional polishing.

## Submission format

- [ ] Submit via Codegrade by pushing commits to your `main` branch on Github.
- [ ] Check Codegrade before the deadline to compare its results against your local tests.
- [ ] Check Codegrade on the days following the Sprint Challenge for reviewer feedback.
- [ ] New commits will be evaluated by Codegrade if pushed _before_ the sprint challenge deadline.

## Interview Questions

Be prepared to demonstrate your understanding of this week's concepts by answering questions on the following topics.

1.  Differences between using _sessions_ or _JSON Web Tokens_ for authentication.
    JWTs are widely used as it scales better than that of a session-cookie based because tokens are stored on the client-side while the session uses the server memory to store user data. If we only want to send a client authentication to specific data and not all data we can use JWTs because they make a request to the server and only comeback with authorized data.

        JWT's are stateless, meaning they are never saved to the database. Instead, they are encrypted tokens that are signed (to ensure they do are not altered and are authentic) and include the user_id right inside the token- thus no database lookup is required to identify the user. API calls that require authentication must include an Authorization token in the header to go through.

        With sessions, after a user successfully logs in, the server will generate a sessionId, signed with a secret key, and save that into the database. On the client side, it will send a cookie with that sessionId to the browser and the browser will save that cookie to local storage and include the cookie on every request.

2.  What does `bcryptjs` do to help us store passwords in a secure manner?
    bycrypt allows use to hash a password so that the password does not show up in the data object as the real password. Bcryptjs also adds a random "salt" to the password the user enters and allows you to hash the password as many times as 2^8 etc etc, making it even harder to reverse engineer for hackers.
3.  How are unit tests different from integration and end-to-end testing?
    Unit testing is different from end to end testing because unit tests only tests specific functions as opposed to e2e testing where we are passing in fake data to fill in as if a client was using our website. End to end testing allows us to see where our code might be failing once it is in the hands of a client interaction.
4.  How does _Test Driven Development_ change the way we write applications and tests?
    Test driven development works backwords. As opposed to writing our code first and ensuring that our code is working, we use tests to develop. We create a test for the functionality that we want in our code and then we program so that our tests pass. A downside to this is that we sometimes can get passing tests without our code doing what it wants to do.
