#!/bin/bash
TEXT_ART=$(cat << "EOF"
███╗░░░███╗░█████╗░░██████╗████████╗███████╗██████╗░
████╗░████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██╔████╔██║███████║╚█████╗░░░░██║░░░█████╗░░██████╔╝
██║╚██╔╝██║██╔══██║░╚═══██╗░░░██║░░░██╔══╝░░██╔══██╗
██║░╚═╝░██║██║░░██║██████╔╝░░░██║░░░███████╗██║░░██║
╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░╚══════╝╚═╝░░╚═╝
EOF
)
echo "$TEXT_ART"
INSTALL_PACKAGES=true
GIT_PULL=true
for arg in "$@"; do
    case $arg in
        --no-install)
            INSTALL_PACKAGES=false
            shift
            ;;
        --no-git-pull)
            GIT_PULL=false
            shift
            GIT_PULL_ARGS="$1" 
            shift
            ;;
        *)
            echo "Unknown argument: $arg"
            exit 1
            ;;
    esac
done
if [ "$GIT_PULL" = true ]; then
    git pull $GIT_PULL_ARGS
fi
yarn production