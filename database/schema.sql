set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"username" TEXT NOT NULL UNIQUE,
	"userId" serial NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL UNIQUE,
	"joinedAt" timestamp with time zone not null default now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."entries" (
	"weight" int NOT NULL,
	"date" DATE NOT NULL UNIQUE,
	"userId" serial NOT NULL UNIQUE,
	"entryId" serial NOT NULL UNIQUE,
	"photoUrl" TEXT UNIQUE,
	CONSTRAINT "entries_pk" PRIMARY KEY ("entryId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "entries" ADD CONSTRAINT "entries_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
