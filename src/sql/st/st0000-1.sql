-- at time zone 'Asia/Seoul'
-- timestamp 에 시간을 명시적으로 기록할 수 있음
-- 아래는 시간 계산을 잘못해서 적재 한 것 같음 ㅜㅜ +9 해줘야 됨 ;;
-- author 가 없는 경우임
select post_id, author, permlink, 'https://steemit.com/@' || author || '/' || permlink as link, title, to_char(created_at + INTERVAL '9 HOUR', 'YYYY-MM-DD HH24:MI:SS') created_at  from hive_posts_cache hpc
where 1=1
  and title <> '' -- 댓글 제외, st0000 에는 조건 넣음 안됨, 더 느려짐
order by post_id desc
limit $1 -- limit : default 10
offset $2 -- offset : start at 0