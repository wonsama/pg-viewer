-- file : pg0002.sql
-- title : MODIFY_PAGE_TITLE
-- @since 2022-09-06T14:27:55.651Z (UTC)
select 
	a.column_name, a.is_nullable, a.column_default, a.data_type, coalesce(a.character_maximum_length, a.numeric_precision) len,
	b.constraint_name, b.constraint_type,
	c.comment
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
			and kcu.table_name = '$3'
	) b on 1=1
			and a.column_name = b.column_name
	left outer join (
		select 
			c2.attname  as column_name,
			(SELECT col_description(c2.attrelid, c2.attnum)) AS comment
		from
			pg_catalog.pg_class c1
			inner join pg_catalog.pg_attribute c2 on c2.attrelid = c1.oid
		where 1=1
			and c1.relname = '$3'
			and c2.attnum > 0
			and c2.attisdropped is false
			and pg_catalog.pg_table_is_visible(c1.oid)
	) c on 1=1
		and a.column_name = c.column_name
where 
	table_schema = 'public'
	and table_name   = '$3' 
order by 
	a.ordinal_position 
-- limit $1 -- limit : default 10
-- offset $2 -- offset : start with 0