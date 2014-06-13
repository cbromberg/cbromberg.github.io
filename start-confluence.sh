#!/bin/bash
function setShellTitle {
    echo -en "\033]2;$@\007"
}

setShellTitle 'Running Confluence OnDemand'

atlas-run-standalone --product confluence --version 5.5-OD-23-004 --bundled-plugins com.atlassian.plugins:atlassian-connect-plugin:1.0.2,com.atlassian.jwt:jwt-plugin:1.0.0,com.atlassian.bundles:json-schema-validator-atlassian-bundle:1.0-m0 --jvmargs -Datlassian.upm.on.demand=true