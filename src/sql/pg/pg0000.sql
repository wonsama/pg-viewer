-- 테이블 목록 정보를 반환한다
-- @since 22.08.31
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
limit $1 -- limit : default 10
offset $2 -- offset : start at 0