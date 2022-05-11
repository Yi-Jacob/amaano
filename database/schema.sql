set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."bookmarks" (
	"bookmarkId" serial NOT NULL,
	"userId" integer NOT NULL,
	"walletAddress" TEXT NOT NULL,
	"data" json NOT NULL,
	"bookmarkedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "bookmarks_pk" PRIMARY KEY ("bookmarkId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
