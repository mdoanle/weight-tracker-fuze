set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."entries" (
	"weight" TEXT NOT NULL,
	"date" DATE NOT NULL UNIQUE,
	"entryId" serial NOT NULL UNIQUE,
  "photoUrl" TEXT
) WITH (
  OIDS=FALSE
);
