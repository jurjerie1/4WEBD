FROM postgres:15
RUN apt-get update && apt-get install -y curl

RUN mkdir -p /docker-entrypoint-initdb.d
RUN echo '#!/bin/bash\n\
set -e\n\
set -u\n\
\n\
function create_user_and_database() {\n\
    local database=$1\n\
    echo "Creating user and database "$database""\n\
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL\n\
        CREATE DATABASE $database;\n\
        GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;\n\
EOSQL\n\
}\n\
\n\
if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then\n\
    echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"\n\
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr "," " "); do\n\
        create_user_and_database $db\n\
    done\n\
    echo "Multiple databases created"\n\
fi' > /docker-entrypoint-initdb.d/create-multiple-db.sh

RUN chmod +x /docker-entrypoint-initdb.d/create-multiple-db.sh