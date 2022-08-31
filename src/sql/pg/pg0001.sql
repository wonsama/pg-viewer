-- file : pg0001.sql
-- title : MODIFY_PAGE_TITLE
-- @since 2022-08-31T11:27:53.879Z (UTC)
select 
	a.column_name, a.is_nullable, a.column_default, a.data_type, coalesce(a.character_maximum_length, a.numeric_precision) len,
	b.constraint_name, b.constraint_type
from 
	information_schema.columns a
	left outer join (
		select 
			tco.constraint_name, kcu.ordinal_position, kcu.column_name, tco.constraint_type
		from 
			information_schema.table_constraints tco
		join 
			information_schema.key_column_usage kcu on 
				kcu.constraint_name = tco.constraint_name
				and kcu.constraint_schema = tco.constraint_schema
				and kcu.constraint_name = tco.constraint_name
		where 1=1
			and kcu.table_schema = 'public'
			and kcu.table_name = 'hive_accounts'
	) b on 1=1
			and a.column_name = b.column_name
where 
	table_schema = 'public'
	and table_name   = 'hive_accounts' 
order by 
	a.ordinal_position 
-- limit $1 -- limit : default 10
-- offset $2 -- offset : start with 0