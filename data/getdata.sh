#! /bin/bash

arr=(1994
1995
1996
1997
1998
1999
2000
2001
2002
2003
2004
2005
2006
2007
2008
2009
2010
2011
2012
2013
2014
2015
2016
2017
2018)

for d in ${arr[@]}; do
    wget -v ftp://ftp.nhtsa.dot.gov/fars/${d}/National/FARS${d}NationalCSV.zip
done


