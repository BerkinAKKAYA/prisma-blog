# Prisma Blog by Berkin AKKAYA

[Live Here](https://prisma-blog-flame.vercel.app/)

## Technologies Used

* PostgreSQL on Heroku
* Prisma as ORM
* Next as Front-End Framework
* [Material UI](mui.com) as UI Kit

## TODO

- [x] Create Next App with Jest
- [x] Create Local DB with SQLite
- [x] Create Live DB with PostgreSQL
- [x] Implement Next Auth
- [x] Add "Create Blog Post" page
- [ ] Write Tests for Core Logical Components using RTL and Jest
- [x] Deploy on Vercel
- [x] Add Pagination
- [x] Add Global Post Search
- [x] Add "Post Detail" Page
- [x] Add "Edit Post" Page
- [x] Add Global Layout
- [x] Add Auth Controls (Edit Post, My Posts, Create Post)
- [x] Add Null Checks For Posts (Edit Post, Post Detail)
- [x] Add Delete Button in 'Edit Post' page

## NOTE

If the app gives the error code 500, probably heroku rotated the DB Credentials. Run the command below and update the DATABASE_URL environment variable.
`heroku config:get DATABASE_URL -a prisma-blog-berkin`
