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
    table_name = cursor.fetchall()[0][0]
    assert r.status_code == 200
    assert table_name == 'metadata'


def test_db_insert(db):
    time.sleep(2)
    xml_data = '''<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="urn:example:idp">
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
<KeyDescriptor use="signing">
<KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
<X509Data>
<X509Certificate>MIIDPDCCAiQCCQDydJgOlszqbzANBgkqhkiG9w0BAQUFADBgMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEQMA4GA1UEChMHSmFua3lDbzESMBAGA1UEAxMJbG9jYWxob3N0MB4XDTE0MDMxMjE5NDYzM1oXDTI3MTExOTE5NDYzM1owYDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28xEDAOBgNVBAoTB0phbmt5Q28xEjAQBgNVBAMTCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMGvJpRTTasRUSPqcbqCG+ZnTAurnu0vVpIG9lzExnh11o/BGmzu7lB+yLHcEdwrKBBmpepDBPCYxpVajvuEhZdKFx/Fdy6j5mH3rrW0Bh/zd36CoUNjbbhHyTjeM7FN2yF3u9lcyubuvOzr3B3gX66IwJlU46+wzcQVhSOlMk2tXR+fIKQExFrOuK9tbX3JIBUqItpI+HnAow509CnM134svw8PTFLkR6/CcMqnDfDK1m993PyoC1Y+N4X9XkhSmEQoAlAHPI5LHrvuujM13nvtoVYvKYoj7ScgumkpWNEvX652LfXOnKYlkB8ZybuxmFfIkzedQrbJsyOhfL03cMECAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAeHwzqwnzGEkxjzSD47imXaTqtYyETZow7XwBc0ZaFS50qRFJUgKTAmKS1xQBP/qHpStsROT35DUxJAE6NY1Kbq3ZbCuhGoSlY0L7VzVT5tpu4EY8+Dq/u2EjRmmhoL7UkskvIZ2n1DdERtd+YUMTeqYl9co43csZwDno/IKomeN5qaPc39IZjikJ+nUC6kPFKeu/3j9rgHNlRtocI6S1FdtFz9OZMQlpr0JbUt2T3xS/YoQJn6coDmJL5GTiiKM6cOe+Ur1VwzS1JEDbSS2TWWhzq8ojLdrotYLGd9JOsoQhElmz+tMfCFQUFLExinPAyy7YHlSiVX13QH2XTu/iQQ==</X509Certificate>
</X509Data>
</KeyInfo>
</KeyDescriptor>
<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="http://idp.oktadev.com/logout"/>
<NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat>
<NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat>
<NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</NameIDFormat>
<SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="http://idp.oktadev.com"/>
<Attribute xmlns="urn:oasis:names:tc:SAML:2.0:assertion" Name="Email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri" FriendlyName="E-Mail Address"/>
<Attribute xmlns="urn:oasis:names:tc:SAML:2.0:assertion" Name="FirstName" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri" FriendlyName="First Name"/>
<Attribute xmlns="urn:oasis:names:tc:SAML:2.0:assertion" Name="LastName" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri" FriendlyName="Last Name"/>
</IDPSSODescriptor>
</EntityDescriptor>'''
    r = requests.post(UPLOAD_METADATA_URL, data=xml_data)
    signOnUrl = "http://idp.oktadev.com"
    entityID = "urn:example:idp"
    cursor = db.execute("INSERT INTO metadata(entityId, signOnUrl) select \'" + entityID + "\', \'" + signOnUrl +
                        "\' where not exists (select 1 from metadata where entityID = \'" + entityID + "\' and signOnUrl = \'" + signOnUrl + "\')")
    row_count = cursor.rowcount
    assert row_count == 1 or row_count == 0
    assert r.status_code


def test_3_db_selection(db):
    time.sleep(2)
    conn = sqlite3.connect("../metadata.db")
    entity_id = "urn:example:idp"
    cursor = conn.execute("SELECT * from metadata where entityId = \'" + entity_id + "\'")
    row = cursor.fetchone()
    if row != None:
        signOnUrl = row[1]
        assert signOnUrl == 'http://idp.oktadev.com'

