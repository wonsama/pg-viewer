-- at time zone 'Asia/Seoul'
-- timestamp 에 시간을 명시적으로 기록할 수 있음
-- 아래는 시간 계산을 잘못해서 적재 한 것 같음 ㅜㅜ +9 해줘야 됨 ;;
select post_id, author, permlink, 'https://steemit.com/@' || author || '/' || permlink as link, title, to_char(created_at + INTERVAL '9 HOUR', 'YYYY-MM-DD HH24:MI:SS') created_at  from hive_posts_cache hpc
where post_id in
(
SELECT post_id
FROM public.hive_feed_cache
where 1=1
and account_id = (select id from public.hive_accounts where name = '$1')
)
and author = '$1'
order by post_id desc
limit $2 -- limit : default 10
offset $3 -- offset : start at 0