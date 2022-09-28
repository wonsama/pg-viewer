-- file : ln0000.sql
-- title : MODIFY_PAGE_TITLE
-- @since 2022-09-28T12:40:23.720Z (UTC)
select
	link_cd, link_title, link_uri, link_desc
from
	stm_link_dev
where 1=1
:exist($3)    and link_cd = '$3'
:exist($4)    and link_title like '%$4%'
limit $1 -- limit : default 10
offset $2 -- offset : start with 0