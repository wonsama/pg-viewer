-- file : st0001.sql
-- title : 컨텐츠 목록 보기
-- @since 2022-09-13T16:26:36.415Z (UTC)
select hp.id, hp.author, hp.permlink, to_char(hp.created_at + INTERVAL '9 HOUR', 'YYYY-MM-DD HH24:MI:SS') created_at, 'https://steemit.com/@' || hp.author || '/' || hp.permlink as link, hpc.title
from hive_posts hp 
left outer join hive_posts_cache hpc on 1=1
	and hp.id = hpc.post_id 
where 1=1
and hp.depth = 0 
and hp.is_deleted = false
:exist($3)  and hp.community_id = $3
:exist($4)  and hp.author = '$4'
order by hp.id desc 
limit $1 -- limit : default 10
offset $2 -- offset : start with 0