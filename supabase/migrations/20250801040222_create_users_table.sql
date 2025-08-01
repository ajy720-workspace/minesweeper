CREATE TABLE "public"."users" (
    "id" bigint NOT NULL,
    "username" "text" NOT NULL,
    "password" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE SEQUENCE "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."users_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";

ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");
