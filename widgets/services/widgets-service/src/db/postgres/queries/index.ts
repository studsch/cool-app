import db from "..";

export async function getUserInfoMostLikedByUserID(id: string) {
  return db`
WITH likes AS (
  SELECT p.user_id, COUNT(p.user_id) AS liked_times
  FROM post AS p
  WHERE p.id IN (
    SELECT lp.post_id
    FROM like_post AS lp
    WHERE lp.user_id = ${id}::uuid
  ) GROUP BY p.user_id
) SELECT u.id, u.first_name, u.last_name, u.login, u.avatar, l.liked_times
FROM likes AS l
LEFT JOIN users AS u ON l.user_id = u.id
ORDER BY l.liked_times DESC LIMIT 1
`;
}
