-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorMail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
