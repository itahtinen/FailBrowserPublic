import psycopg2
from pprint import pprint
import os

def connect():
    connection = psycopg2.connect(
        user=os.environ.get("FB_PY_DB_USER", "masteruser"),
        password=os.environ.get("FB_PY_DB_PASS", "QwertY1234"),
        host=os.environ.get("FB_PY_DB_HOST", "fbstack-dub-apidbcluster-ecgf4xc4kdqr.cluster-c21gcwumlkoy.eu-west-1.rds.amazonaws.com"),
        port=os.environ.get("FB_PY_DB_PORT", "5432"),
        database=os.environ.get("FB_PY_DB_DATABASE", "fbdb"),
    )
    return connection


def runscript(fname):
    cont = open(fname).read()
    connection = connect()
    cursor = connection.cursor()
    cursor.execute(cont)
    connection.commit()


def insert_suite(suite):

    connection = connect()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO T_SUITE(NAME, ID, SOURCE, PARENTID) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING",
        (suite.name, suite.id, suite.src, suite.parentid),
    )
    connection.commit()


def insert_tests(samples, suite, logid):
    connection = connect()
    cursor = connection.cursor()
    datas = [(sample.id, sample.status, sample.name, logid) for sample in samples]
    cursor.executemany(
        "INSERT INTO T_SAMPLE(CASEID, STATUS, NAME, LOGID) VALUES (%s, %s, %s, %s)",
        datas,
    )
    connection.commit()


def insert_t_cases(samples, suite):

    connection = connect()
    cursor = connection.cursor()
    datas = [(sample.id, sample.name, suite.id) for sample in samples]
    cursor.executemany(
        "INSERT INTO T_CASE(ID, NAME, SUITEID) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
        datas,
    )
    connection.commit()


def insert_t_log(id, name, gen):

    connection = connect()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO T_LOG(ID, NAME, GENERATED) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
        (id, name, gen),
    )
    connection.commit()


runscript("db.sql")
