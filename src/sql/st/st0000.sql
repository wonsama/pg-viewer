-- at time zone 'Asia/Seoul'
-- timestamp 에 시간을 명시적으로 기록할 수 있음
-- 아래는 시간 계산을 잘못해서 적재 한 것 같음 ㅜㅜ +9 해줘야 됨 ;;
select post_id, author, permlink, 'https://steemit.com/@' || author || '/' || permlink as link, title, to_char(created_at + INTERVAL '9 HOUR', 'YYYY-MM-DD HH24:MI:SS') created_at  from hive_posts_cache hpc
where 1=1
:notexist($3)  and title <> ''
:exist($3)  and post_id in
:exist($3)  (
:exist($3)  SELECT post_id
:exist($3)  FROM public.hive_feed_cache
:exist($3)  where 1=1
:exist($3)  and account_id = (select id from public.hive_accounts where name = '$3')
:exist($3)  )
:exist($3)  and author = '$3'
order by post_id desc
limit $1 -- limit : default 10
offset $2 -- offset : start at 0