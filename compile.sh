#!/bin/bash

FILEPATH="$1"
TSFILEPATH=`echo $FILEPATH | sed -e "s/\.js$/\.ts/g"`

angularjs-to-typescript $FILEPATH

exit $?