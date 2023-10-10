#!/bin/sh

set -o errexit
set -o nounset


# Run a Celery worker
celery -A core worker --loglevel=info