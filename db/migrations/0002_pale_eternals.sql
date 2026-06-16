CREATE TABLE "emails" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subject" text,
	"snippet" text,
	"from" text,
	"date" timestamp,
	"priority" text DEFAULT 'normal',
	"category" text DEFAULT 'primary',
	"manual_priority" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "thread_id" text NOT NULL;