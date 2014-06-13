#!/bin/bash
function setShellTitle {
    echo -en "\033]2;$@\007"
}

setShellTitle 'Running http-server'

http-server