-- TM_JIS_LINE_STATION
select 
'INSERT INTO "TM_JIS_LINE_STATION"("ID", "LINE_STATION_NAME", "PLANT_ID", "DELETE_MARK")'
+' VALUES (' + cast(cId as nvarchar)
+', ''' + cLsName
+''', ' + cast(cCustomerPoboxId as nvarchar)
+', ''N'');'
,* 
from tJISLineStation_WV
