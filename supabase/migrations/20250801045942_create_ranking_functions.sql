-- 1. get_ranking function
CREATE OR REPLACE FUNCTION get_ranking(p_difficulty TEXT)
RETURNS TABLE (
  rank BIGINT,
  username TEXT,
  clear_time_ms BIGINT,
  score BIGINT,
  played_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    RANK() OVER (ORDER BY gr.clear_time_ms ASC, gr.score DESC) as rank,
    u.username,
    gr.clear_time_ms,
    gr.score,
    gr.played_at
  FROM
    public.game_records gr
  JOIN
    public.users u ON gr.user_id = u.id
  WHERE
    gr.difficulty = p_difficulty AND gr.win = TRUE
  ORDER BY
    rank
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- 2. get_user_ranking_stats function
CREATE OR REPLACE FUNCTION get_user_ranking_stats(p_user_id BIGINT, p_difficulty TEXT)
RETURNS TABLE (
  best_time_ms BIGINT,
  user_rank BIGINT,
  total_players BIGINT,
  percentile NUMERIC
) AS $$
DECLARE
    user_best_record RECORD;
    total_count BIGINT;
BEGIN
    -- Find the user's best record for the given difficulty
    SELECT
        clear_time_ms,
        score
    INTO user_best_record
    FROM public.game_records
    WHERE user_id = p_user_id AND difficulty = p_difficulty AND win = TRUE
    ORDER BY clear_time_ms ASC, score DESC
    LIMIT 1;

    IF FOUND THEN
        best_time_ms := user_best_record.clear_time_ms;

        -- Calculate the rank of that best record
        SELECT
            COUNT(*) + 1
        INTO user_rank
        FROM public.game_records
        WHERE
            difficulty = p_difficulty
            AND win = TRUE
            AND (
                clear_time_ms < user_best_record.clear_time_ms
                OR (clear_time_ms = user_best_record.clear_time_ms AND score > user_best_record.score)
            );

        -- Get the total number of players for the difficulty
        SELECT
            COUNT(DISTINCT user_id)
        INTO total_players
        FROM public.game_records
        WHERE difficulty = p_difficulty AND win = TRUE;

        total_count := total_players;

        -- Calculate percentile
        IF total_count > 0 THEN
            percentile := (user_rank::NUMERIC / total_count::NUMERIC) * 100.0;
        ELSE
            percentile := 100.0;
        END IF;

    ELSE
        -- User has no record for this difficulty
        best_time_ms := NULL;
        user_rank := NULL;
        total_players := (SELECT COUNT(DISTINCT user_id) FROM public.game_records WHERE difficulty = p_difficulty AND win = TRUE);
        percentile := NULL;
    END IF;

    RETURN QUERY SELECT best_time_ms, user_rank, total_players, percentile;
END;
$$ LANGUAGE plpgsql;
