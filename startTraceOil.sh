#!/bin/sh

cd ~/forever-logs/traceoil
forever start -o ./output.log -e ./error.log --workingDir ~/TRACEOIL -a ~/TRACEOIL/app.js

