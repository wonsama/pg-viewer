-- file : st0001-1.sql
-- title : 클릭 이후 상세 정보(컨텐츠 내용) 보기 
-- @since 2022-09-13T16:26:36.415Z (UTC)
select 
	post_id, author, permlink , category , children , author_rep , total_votes , title , body 
from 
	hive_posts_cache 
where 1=1
	and post_id ='$3' -- must input
limit $1 -- limit : default 10
offset $2 -- offset : start with 0