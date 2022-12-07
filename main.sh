#!/bin/bash

# echo $1
rm `pwd`/Target/*.blend 

python3 `pwd`/main.py `pwd`/uploads/$1
# python3 `pwd`/main.py `which blender` `pwd`/uploads/$1
python3 `pwd`/converter.py

mv `pwd`/Target/floorplan.glb `pwd`/Target/$2