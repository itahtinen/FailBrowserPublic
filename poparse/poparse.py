import xml.etree.ElementTree as ET
from pprint import pprint
import hashlib
import dbaccess
from collections import namedtuple
import glob
import os
import time
import sys

start = time.time()

Suite = namedtuple("Suite", ["name", "id", "src", "parentid"])

Sample = namedtuple("Sample", ["id", "name", "status"])

Log = []


def parse_test(node, seed):

    status = node.find(".//status").attrib
    idd = gethash((seed + node.attrib["name"]).encode())
    return Sample(id=idd, name=node.attrib["name"], status=status["status"])


def gethash(inp):

    return hashlib.md5(inp).hexdigest()


def get_parent_id(fname):
    name = "::".join(fname.replace("\\", "/").split("/")[-3:-1])
    return gethash(name.encode()), name


def parse_suite(suite):
    sa = suite.attrib
    fname = sa["source"]
    parentid, parentname = get_parent_id(fname)
    src = os.path.basename(fname)
    idd = gethash(src.encode())
    return (
        Suite(id=idd, name=sa["name"], src=src, parentid=parentid),
        Suite(id=parentid, name=parentname, src=None, parentid=None),
    )


def get_suite_entries(fname, root):

    arr = []
    parents = set()

    for suite in root.findall(".//test/.."):

        tests = suite.iter("test")
        ss, parent = parse_suite(suite)
        seed = ss[0]
        testlist = [parse_test(t, seed) for t in tests]
        if parent.id not in parents:
            parents.add(parent.id)
            arr.append((parent, []))

        arr.append((ss, testlist))

    return arr


def feed_xml(fname):
    cont = open(fname, "rb").read()
    logid = gethash(cont)
    tree = ET.parse(fname)
    root = tree.getroot()
    gen = root.attrib.get("generated")
    dbaccess.insert_t_log(logid, fname, gen)

    data = get_suite_entries(fname, root)
    for suite, tests in data:
        dbaccess.insert_suite(suite)
        dbaccess.insert_tests(tests, suite, logid)
        dbaccess.insert_t_cases(tests, suite)


def main():
    for a in sys.argv[1:]:
        os.path.isfile(a)
        files = glob.glob(a)
        for f in files:
            feed_xml(f)


def get_file(a):
    files = glob.glob(a)
    for f in files:
        feed_xml(f)


if __name__ == "__main__":
    main()
    end = time.time()
    pprint("Script ran in: ")
    pprint(end - start)
