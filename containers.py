from __future__ import print_function 

import subprocess
import itertools

PG_NAME = "ade-pg-fbrowser"
PG_DB_PATH = "c:/docker/ade/pg"

MINIO_NAME = "ade-minio"
MINIO_DB_PATH = "c:/docker/ade/minio/db"
MINIO_CONFIG_PATH = "c:/docker/ade/minio/config"

ORACLE_DB_PATH = "c:/docker/ade/oracle/emptydatabase"
ORACLE_IMAGE_NAME = "ade-oracle"

PG_PORT_OFFSET = 5432
MINIO_PORT_OFFSET = 900
BASE_PORT = 0

RABBIT_NAME = "ade-rabbit"
RABBIT_PORT = 15672


ORACLE_PORT = 1521


def c(cmd):
    print(">", " ".join(cmd))

    subprocess.call(cmd)

def volume_args(volumes):
    return list(itertools.chain(*[["-v", "%s:%s" % t] for t in volumes ]))


def docker_run(name, ports,args):
    (ext_port, int_port) = ports
    c(["docker", "run", "--name", name, "-p", "%d:%s" % (ext_port,int_port)] + args)


def pg_init():
    pg_port = BASE_PORT + PG_PORT_OFFSET
    c(["docker", "pull", "postgres"])
    docker_run(PG_NAME, (pg_port, 5432), ["-e","POSTGRES_PASSWORD=docker", "postgres"])

def minio_init():
    minio_port = BASE_PORT + MINIO_PORT_OFFSET
    vols = volume_args([(MINIO_DB_PATH, "/data"), (MINIO_CONFIG_PATH, "/root/.minio")])
    docker_run(MINIO_NAME, (minio_port, 9000), vols  + ["minio/minio", "server", "/data"])

def init_oracle():
    vols = volume_args([(ORACLE_DB_PATH, "/u01/app/oracle")])
    docker_run(ORACLE_IMAGE_NAME, (ORACLE_PORT, ORACLE_PORT), vols + ["-d", "laboratoriobridge/oracle-12c"] )

def rabbit_init():
    docker_run(RABBIT_NAME, (RABBIT_PORT, 5672), ["-d", "--hostname", RABBIT_NAME, "rabbitmq:3"] )



#rabbit_init()

#docker run -p 9000:9000 --name minio1 -v /mnt/data:/data -v /mnt/config:/root/.minio minio/minio server /data
# minio_init()
pg_init()