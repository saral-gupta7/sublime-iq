/*
  Warnings:

  - A unique constraint covering the columns `[userId,topic]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Course_topic_key";

-- CreateIndex
CREATE UNIQUE INDEX "Course_userId_topic_key" ON "Course"("userId", "topic");
