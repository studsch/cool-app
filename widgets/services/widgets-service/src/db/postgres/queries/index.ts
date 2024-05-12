import db from "..";

export async function getUserInfoMostLikedByUserId(id: string) {
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

export async function getMostLikedTagByUserId(id: string) {
  return db`
SELECT t.id, t.title, COUNT(t.title) AS count
FROM like_post AS lp
LEFT JOIN post_tags pt ON lp.post_id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE lp.user_id = ${id}::uuid
GROUP BY t.id, t.title
ORDER BY count DESC
LIMIT 1
`;
}
