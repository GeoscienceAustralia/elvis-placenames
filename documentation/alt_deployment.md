# Alternative Deployment

## Overview

This document describes steps and resources required to deploy a new instance of `placenames` application/web site hosted on AWS/EC2.

## Steps

1. Launch an EC2 instance. This deployment was tested on the following EC2 instance: Amazon Linux 2, t3.small, 15 GiB. Attach the `FSDFInstanceRole` role and `sg-6e50290a` security group to the instance at launch time or after the launch (for the IAM role and security group see the `ga-elevation` account).

2. Install Nessusagent. There are 2 options: a) manual installation or b) ussing SSM. For the latter an SSM role needs to be attached to the instance. As there is the `FSDFInstanceRole` role attached to the isntance, policies need to be added to the `FSDFInstanceRole` role if the SSM installation is used. See [Tenable Installation Guide](https://intranet.ga.gov.au/confluence/display/ARCHCOM/Tenable+Installation+Guide) and Tenable documentation.

3. Copy the `elvis-placenames/deployment/alt_deploy` script to the instance.

4. Run the script once, e.g. `/bin/bash alt_deploy`

5. If domain names other than `placenames.fsdf.org.au` or `placenames-dev.*` are used, edit the `/etc/httpd/conf.d/placenames.conf` file.

6. Reboot the instance.
