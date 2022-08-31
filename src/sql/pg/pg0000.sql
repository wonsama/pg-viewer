-- 테이블 목록 정보를 반환한다
-- @since 22.08.31
select t.*
from
(
select
    a.tablename,
    a.hasindexes,
    a."tablespace" ,
    coalesce(obj_description(b.oid),a.tablename) tabledesc
from
    pg_catalog.pg_tables a
left outer join pg_class b on 1=1
    and a.tablename  = b.relname 	
where 1=1
    and a.schemaname = 'public' -- public, iwpdev, iwptest
    and a.tableowner = 'steem' -- steem, iwpdevusr, iwptestdba
:exist($3)    and a.tablename like '%$3%'
) t
where 1=1
:exist($4)    and t.tabledesc like '%$4%'
limit $1 -- limit : default 10
offset $2 -- offset : start at 0