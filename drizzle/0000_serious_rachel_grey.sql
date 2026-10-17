CREATE TABLE "orders" (
	"number" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"wilaya" integer NOT NULL,
	"commune" text NOT NULL,
	"delivery_type" text NOT NULL,
	"items" text NOT NULL,
	"subtotal" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"delivery_fee" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"otp" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"publisher" text NOT NULL,
	"price" integer NOT NULL,
	"old_price" integer,
	"stock" integer DEFAULT 0 NOT NULL,
	"sold" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"rating" integer DEFAULT 45 NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stock_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"contact" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
