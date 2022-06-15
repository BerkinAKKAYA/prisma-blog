# Prisma Blog by Berkin AKKAYA

[Live Here](https://prisma-blog-flame.vercel.app/)

## Technologies Used
* PostgreSQL on Heroku
* Prisma ORM
* Next
* Next Auth
* [Material UI](mui.com) as UI Kit

## Screenshots


|Home|Edit|Unauthorized|
|---|---|---|
|<img width="616" alt="image" src="https://user-images.githubusercontent.com/32297518/173802166-fa27372e-ff12-46a8-939d-52c2ca4556ad.png">|<img width="618" alt="image" src="https://user-images.githubusercontent.com/32297518/173801734-44ea1b04-39c1-41bd-91a7-ed4be5c7c3a9.png">|<img width="614" alt="image" src="https://user-images.githubusercontent.com/32297518/173801353-1c6b0d89-d029-4a74-9732-51be7d354eaa.png">|

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
