#!/bin/bash
############################
# This script creates starts two forever.js daemons.
# The first daemon starts the scraper, and the second
# daemon starts the server.
############################

NODE_ENV=production
forever start -a -e scraperErr.log -o scraperOut.log job.js
forever start -a -e serverErr.log -o serverOut.log ./bin/www
