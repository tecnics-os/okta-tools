from api_methods import saml
import sqlite3
import pytest
import requests
import sys
import time
from parse_xml import parse_xml
API_URL = "http://127.0.0.1:5000/api"
VALIDATE_ENTITYID_URL = '{}/validateEntityId'.format(API_URL)
UPLOAD_METADATA_URL = '{}/uploadMetadata'.format(API_URL)
sys.path.append("../api")

@pytest.fixture
def db():
    conn = sqlite3.connect("../metadata.db")
    yield conn

def test_1_create_table_on_first_request(db):
    time.sleep(2)
    r = requests.get(VALIDATE_ENTITYID_URL)  
    cursor = db.execute('''CREATE TABLE IF NOT EXISTS metadata(
    entityId varchar(255) primary key,
    signOnUrl varchar(255));''')
    db.commit()
    cursor = db.execute("SELECT name FROM sqlite_master WHERE type='table'")
    table_name =  cursor.fetchall()[0][0]
    assert r.status_code == 200
    assert table_name == 'metadata'

def test_db_insert(db):
    time.sleep(2)
    f = open("test.xml")
    xml_data = f.read()
    r = requests.post(UPLOAD_METADATA_URL, data=xml_data)
    signOnUrl= "http://idp.oktadev.com"
    entityID = "urn:example:idp"
    cursor = db.execute("INSERT INTO metadata(entityId, signOnUrl) select \'" + entityID + "\', \'" + signOnUrl + "\' where not exists (select 1 from metadata where entityID = \'" + entityID + "\' and signOnUrl = \'" + signOnUrl + "\')")
    print(cursor.fetchone())
    assert r.status_code


def test_3_db_selection(db):
    time.sleep(2)
    entity_id = "urn:example:idp"
    r = requests.post(VALIDATE_ENTITYID_URL, data=entity_id)
    cursor = db.execute("SELECT signOnUrl from metadata where entityId = \'" + entity_id + "\';")
    signOnUrl = cursor.fetchall()[0][0]
    assert signOnUrl == 'http://idp.oktadev.com'
    assert r.status_code == 200
