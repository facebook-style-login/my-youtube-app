-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "savedTrends" TEXT
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "service" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "quotaUsed" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "earnings" REAL,
    "analyzedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");
