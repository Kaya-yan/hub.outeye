CREATE TABLE "ai_budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"total_budget" bigint,
	"used" bigint DEFAULT 0,
	"unit" text DEFAULT 'tokens',
	"alert_threshold" integer DEFAULT 80,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pane_id" uuid,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"tokens_used" integer,
	"latency_ms" integer,
	"is_relay" boolean DEFAULT false,
	"relay_from_message_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"provider" text NOT NULL,
	"api_key" text NOT NULL,
	"base_url" text,
	"model_id" text NOT NULL,
	"temperature" numeric(3, 2) DEFAULT '0.7',
	"max_tokens" integer DEFAULT 4096,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_panes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid,
	"model_id" uuid,
	"pane_name" text,
	"position" integer DEFAULT 0,
	"system_prompt" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"project_tag" text,
	"color" text DEFAULT '#06b6d4',
	"is_pinned" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"competition_code" text,
	"status" text DEFAULT 'preparing',
	"deadline" timestamp with time zone,
	"progress" integer DEFAULT 0,
	"materials" jsonb DEFAULT '[]'::jsonb,
	"team_members" text[],
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"category" text,
	"tags" text[],
	"source_url" text,
	"has_image" boolean DEFAULT false,
	"converted_to_task" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_name" text NOT NULL,
	"metric_name" text NOT NULL,
	"metric_value" integer,
	"recorded_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quick_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"icon" text,
	"category" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"project" text,
	"status" text DEFAULT 'todo',
	"priority" text DEFAULT 'medium',
	"due_date" timestamp with time zone,
	"sort_order" integer DEFAULT 0,
	"category" text DEFAULT '学习',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "token_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"tokens" bigint,
	"cost" numeric(10, 2),
	"cost_currency" text DEFAULT 'CNY',
	"purpose" text,
	"project" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weekly_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" timestamp with time zone NOT NULL,
	"day_of_week" integer NOT NULL,
	"time_slot" text NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT '学习',
	"is_done" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_pane_id_ai_panes_id_fk" FOREIGN KEY ("pane_id") REFERENCES "public"."ai_panes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_panes" ADD CONSTRAINT "ai_panes_thread_id_ai_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."ai_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_panes" ADD CONSTRAINT "ai_panes_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_converted_to_task_tasks_id_fk" FOREIGN KEY ("converted_to_task") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;