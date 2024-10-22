@echo off

REM Function to run the scripts
setlocal ENABLEDELAYEDEXPANSION

set "startPage=%1"
set "endPage=%2"

if "%startPage%"=="" goto :usage
if "%endPage%"=="" goto :usage

goto :loop

:usage
echo Usage: run_script.bat start_page end_page
exit /b 1

:loop
set "current=%startPage%"

:run_loop
set /a "next=current + 4"
if %next% gtr %endPage% set "next=%endPage%"

call :run_scripts %current% %next%

set /a "current=next + 1"
if %current% leq %endPage% goto :run_loop

goto :eof

:run_scripts
set "startPage=%1"
set "endPage=%2"

echo Running thai_scrape.js from page %startPage% to %endPage%
node thai_scrape.js %startPage% %endPage%

echo Running cleandata.js
node cleandata.js

echo Running upload.js
node upload.js

goto :eof
