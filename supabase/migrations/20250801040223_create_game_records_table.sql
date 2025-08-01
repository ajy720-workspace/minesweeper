CREATE TABLE "public"."game_records" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "difficulty" "text" NOT NULL,
    "win" boolean NOT NULL,
    "clear_time_ms" bigint NOT NULL,
    "score" bigint NOT NULL,
    "board_size" "text",
    "mine_count" smallint,
    "played_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."game_records" OWNER TO "postgres";

CREATE SEQUENCE "public"."game_records_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."game_records_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."game_records_id_seq" OWNED BY "public"."game_records"."id";

ALTER TABLE ONLY "public"."game_records" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."game_records_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."game_records"
    ADD CONSTRAINT "game_records_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."game_records"
    ADD CONSTRAINT "game_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");
