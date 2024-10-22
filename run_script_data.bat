@echo off

set start=1
set step=5
set max=160

:loop
set /a end=%start%+%step%-1
if %end% geq %max% set end=%max%

echo Running thai_scrape.js from page %start% to %end%
node thai_scrape.js %start% %end%

echo Running cleandata.js
node cleandata.js

echo Running upload.js
node upload.js

if %start% geq %max% goto end
set /a start=%end%+1
goto loop

:end
echo All tasks completed.
