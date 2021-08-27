from api_methods import saml
import requests
import xml.etree.ElementTree as ET
import sys
import bcrypt
from hash_verifier import password_checker
sys.path.append("../api")


class TestAppMethods:
    API_URL = "http://127.0.0.1:5000/api"
    PARSE_METADATA_URL = "{}/parseMetadata".format(API_URL)
    CERTIFICATE_URL = '{}/certificateWithHeader'.format(API_URL)
    FORMAT_CERTIFICATE_URL = '{}/formatCertificate'.format(API_URL)
    UPLOAD_METDATA_URL = '{}/uploadMetadata'.format(API_URL)
    VALIDATE_ENTITYID_URL = '{}/validateEntityId'.format(API_URL)
    PASSWORD_HASH_URL = '{}/verifyPasswordHash'.format(API_URL)
    urls = [PARSE_METADATA_URL, CERTIFICATE_URL,
            FORMAT_CERTIFICATE_URL, UPLOAD_METDATA_URL, VALIDATE_ENTITYID_URL]

    def get_url_test(url):
        r = requests.get(url)
        return r.status_code

    def get_xml_post_data(xml_data):
        r = requests.post(TestAppMethods.PARSE_METADATA_URL, data=xml_data)
        data = r.json()
        return data

    def read_content_from_file(filename):
        f = open(filename, "r")
        xml_data = f.read()
        return xml_data

    def test_urls_get_request(self):
        count = 0
        while count < len(TestAppMethods.urls):
            assert TestAppMethods.get_url_test(
                TestAppMethods.urls[count]) == 200
            count += 1

    def test_parse_metadata(self):

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
        metadata = saml.extract_xml_attributes(xml_data)
        r = requests.post(TestAppMethods.PARSE_METADATA_URL, data=xml_data)
        data = r.json()
        assert r.status_code == 200
        assert data == metadata

    def test_parse_metadata_error(self):

        xml_data = "<student></student>"
        data = TestAppMethods.get_xml_post_data(xml_data)
        assert data['error'] == 'Given data is not a valid metadata.'

    def test_entity_id_missing(self):

        xml_data = '''<EntityDescriptor>
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
        data = TestAppMethods.get_xml_post_data(xml_data)
        assert data['error']['entityID_error'] == 'Given file does not have any entityID.'

    def test_certificate_missing(self):
        xml_data = '''<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="urn:example:idp">
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
<KeyDescriptor use="signing">
<KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
<X509Data>
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
        
        data = TestAppMethods.get_xml_post_data(xml_data)
        assert data['error']['certificate_error'] == 'Given file does not have any certificate.'

    def test_sso_or_acs_url_missing(self):
        
        xml_data = '''<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="https://gni-test-lms.netacad.com/auth/saml2/sp/metadata.php">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:1.1:protocol urn:oasis:names:tc:SAML:2.0:protocol" AuthnRequestsSigned="true">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIEBjCCAu6gAwIBAgIBADANBgkqhkiG9w0BAQsFADCBmzEPMA0GA1UEAwwGbW9vZGxlMQswCQYDVQQGEwJBVTEUMBIGA1UEBwwLbW9vZGxldmlsbGUxLDAqBgkqhkiG9w0BCQEWHW5ldHNwYWNlLW9wZXJhdGlvbnNAY2lzY28uY29tMRUwEwYDVQQKDAxHTkktVEVTVC1MTVMxDzANBgNVBAgMBm1vb2RsZTEPMA0GA1UECwwGbW9vZGxlMB4XDTIwMDMwMjIxNTczNFoXDTMwMDIyODIxNTczNFowgZsxDzANBgNVBAMMBm1vb2RsZTELMAkGA1UEBhMCQVUxFDASBgNVBAcMC21vb2RsZXZpbGxlMSwwKgYJKoZIhvcNAQkBFh1uZXRzcGFjZS1vcGVyYXRpb25zQGNpc2NvLmNvbTEVMBMGA1UECgwMR05JLVRFU1QtTE1TMQ8wDQYDVQQIDAZtb29kbGUxDzANBgNVBAsMBm1vb2RsZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOKMjEXvssSfB6btiG3Kvol+KA8sNHhSF/viGVB6ziMdTJmkLUTTYGxgAVV9YH+OHlwoQvFocks3psmdCD8ZMskRJwdHEDS4Fvb/ZssKiLOEl8trDQ/3jvwo0WUmO+pAzFh2y3ByrUcd4fdvvrFLJvWqtizWk8yFxWhtmMkAdUPOjDWckqJS1oujtFji+GerEE46QVoRUgP1DTzErH6I/Rwlq3oE4G1IHevJUTnCw+ECnyEtJaEFjrGa5UK+ZRLtpkYg8RnLHVQdRSn662GEiEgYN/nKMP6R9eaTWstIrKkH+JKUXwkx/87K3jfMG4Bjr4pZKFoshjvcNUYDv/r9ZB8CAwEAAaNTMFEwHQYDVR0OBBYEFPg+uLpYUoSsscxHk0cDs1Cj8CXGMB8GA1UdIwQYMBaAFPg+uLpYUoSsscxHk0cDs1Cj8CXGMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAIFNpXq1dPjR+Ab1xUYss6yIrLmVYM1MNDFQ7UbMjCRGGp13CGKYQXkfUGO2n/p3m5nYNUzna1lXwhkPMLV3VKf7R80f5BPY7dPa4Yy+e0p/eyEUf9v04ReBT/yNtO3A5UM4tQBCrhNLUFpGL8GY0z3u9W0FmfSmkffVvqq7rKor6uL8d+wjJSXea6EQepVE3dRsTuPzA5mbiKA3tg+3uKv+HMuFygckCMY1p93HwdJDh+upwf3O5i2bAXAI/YfsQZx0FecQ8r6qfjxpslWfS+Z8JdiauN0rR4Ugm75wsaMpPxYH6NLsQbOpAq03eaIOZ5ZxzJCDJ5BbS+WQl6PbLBg=</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <!-- [0][1] -->
    <md:KeyDescriptor use="encryption">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIEBjCCAu6gAwIBAgIBADANBgkqhkiG9w0BAQsFADCBmzEPMA0GA1UEAwwGbW9vZGxlMQswCQYDVQQGEwJBVTEUMBIGA1UEBwwLbW9vZGxldmlsbGUxLDAqBgkqhkiG9w0BCQEWHW5ldHNwYWNlLW9wZXJhdGlvbnNAY2lzY28uY29tMRUwEwYDVQQKDAxHTkktVEVTVC1MTVMxDzANBgNVBAgMBm1vb2RsZTEPMA0GA1UECwwGbW9vZGxlMB4XDTIwMDMwMjIxNTczNFoXDTMwMDIyODIxNTczNFowgZsxDzANBgNVBAMMBm1vb2RsZTELMAkGA1UEBhMCQVUxFDASBgNVBAcMC21vb2RsZXZpbGxlMSwwKgYJKoZIhvcNAQkBFh1uZXRzcGFjZS1vcGVyYXRpb25zQGNpc2NvLmNvbTEVMBMGA1UECgwMR05JLVRFU1QtTE1TMQ8wDQYDVQQIDAZtb29kbGUxDzANBgNVBAsMBm1vb2RsZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOKMjEXvssSfB6btiG3Kvol+KA8sNHhSF/viGVB6ziMdTJmkLUTTYGxgAVV9YH+OHlwoQvFocks3psmdCD8ZMskRJwdHEDS4Fvb/ZssKiLOEl8trDQ/3jvwo0WUmO+pAzFh2y3ByrUcd4fdvvrFLJvWqtizWk8yFxWhtmMkAdUPOjDWckqJS1oujtFji+GerEE46QVoRUgP1DTzErH6I/Rwlq3oE4G1IHevJUTnCw+ECnyEtJaEFjrGa5UK+ZRLtpkYg8RnLHVQdRSn662GEiEgYN/nKMP6R9eaTWstIrKkH+JKUXwkx/87K3jfMG4Bjr4pZKFoshjvcNUYDv/r9ZB8CAwEAAaNTMFEwHQYDVR0OBBYEFPg+uLpYUoSsscxHk0cDs1Cj8CXGMB8GA1UdIwQYMBaAFPg+uLpYUoSsscxHk0cDs1Cj8CXGMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAIFNpXq1dPjR+Ab1xUYss6yIrLmVYM1MNDFQ7UbMjCRGGp13CGKYQXkfUGO2n/p3m5nYNUzna1lXwhkPMLV3VKf7R80f5BPY7dPa4Yy+e0p/eyEUf9v04ReBT/yNtO3A5UM4tQBCrhNLUFpGL8GY0z3u9W0FmfSmkffVvqq7rKor6uL8d+wjJSXea6EQepVE3dRsTuPzA5mbiKA3tg+3uKv+HMuFygckCMY1p93HwdJDh+upwf3O5i2bAXAI/YfsQZx0FecQ8r6qfjxpslWfS+Z8JdiauN0rR4Ugm75wsaMpPxYH6NLsQbOpAq03eaIOZ5ZxzJCDJ5BbS+WQl6PbLBg=</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <!-- [0][2] -->
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://gni-test-lms.netacad.com/auth/saml2/sp/saml2-logout.php/gni-test-lms.netacad.com"/>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    
  </md:SPSSODescriptor>
  <md:Organization>
    <md:OrganizationName xml:lang="en">GNI-TEST-LMS</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">GNI-Test-LMS</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">https://gni-test-lms.netacad.com</md:OrganizationURL>
  </md:Organization>
  <md:ContactPerson contactType="technical">
    <md:GivenName>Admin</md:GivenName>
    <md:SurName>User</md:SurName>
    <md:EmailAddress>noreply@gni-test-moodle-1896885355.us-east-1.elb.amazonaws.com</md:EmailAddress>
  </md:ContactPerson>
</md:EntityDescriptor>
'''
        data = TestAppMethods.get_xml_post_data(xml_data)
        xml_data_in_string = str(xml_data)
        if(xml_data_in_string.__contains__('IDPSSODescriptor')):
            assert data['error']['sso_error'] == 'Given file does not have single sign on service url.'
        elif(xml_data_in_string.__contains__('SPSSODescriptor')):
            assert data['error']['acs_error'] == 'Given file does not have acs url.'

    def test_upload_metadata(self):
        
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
        r = requests.post(TestAppMethods.UPLOAD_METDATA_URL, data=xml_data)
        xml = saml.get_xml_content(xml_data)
        assert r.status_code == 200
        assert xml == r.json()

    def test_certificate_with_header(self):
        
        certificate_text = '''MIIDPDCCAiQCCQDydJgOlszqbzANBgkqhkiG9w0BAQUFADBgMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEQMA4GA1UEChMHSmFua3lDbzESMBAGA1UEAxMJbG9jYWxob3N0MB4XDTE0MDMxMjE5NDYzM1oXDTI3MTExOTE5NDYzM1owYDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28xEDAOBgNVBAoTB0phbmt5Q28xEjAQBgNVBAMTCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMGvJpRTTasRUSPqcbqCG+ZnTAurnu0vVpIG9lzExnh11o/BGmzu7lB+yLHcEdwrKBBmpepDBPCYxpVajvuEhZdKFx/Fdy6j5mH3rrW0Bh/zd36CoUNjbbhHyTjeM7FN2yF3u9lcyubuvOzr3B3gX66IwJlU46+wzcQVhSOlMk2tXR+fIKQExFrOuK9tbX3JIBUqItpI+HnAow509CnM134svw8PTFLkR6/CcMqnDfDK1m993PyoC1Y+N4X9XkhSmEQoAlAHPI5LHrvuujM13nvtoVYvKYoj7ScgumkpWNEvX652LfXOnKYlkB8ZybuxmFfIkzedQrbJsyOhfL03cMECAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAeHwzqwnzGEkxjzSD47imXaTqtYyETZow7XwBc0ZaFS50qRFJUgKTAmKS1xQBP/qHpStsROT35DUxJAE6NY1Kbq3ZbCuhGoSlY0L7VzVT5tpu4EY8+Dq/u2EjRmmhoL7UkskvIZ2n1DdERtd+YUMTeqYl9co43csZwDno/IKomeN5qaPc39IZjikJ+nUC6kPFKeu/3j9rgHNlRtocI6S1FdtFz9OZMQlpr0JbUt2T3xS/YoQJn6coDmJL5GTiiKM6cOe+Ur1VwzS1JEDbSS2TWWhzq8ojLdrotYLGd9JOsoQhElmz+tMfCFQUFLExinPAyy7YHlSiVX13QH2XTu/iQQ=='''
        r = requests.post(TestAppMethods.CERTIFICATE_URL,
                          data=certificate_text)
        formatted_certificate = saml.get_certificate_with_header(
            certificate_text)
        data = r.json()
        certificate_data = data['certificate']
        certificate_data_in_string = str(certificate_data)
        index_after_header = certificate_data_in_string.index('\n')
        assert r.status_code == 200
        assert certificate_data == formatted_certificate
        assert certificate_data_in_string.startswith(
            '-----BEGIN CERTIFICATE-----')
        assert certificate_data_in_string.endswith(
            '-----END CERTIFICATE-----\n')
        assert certificate_data_in_string[(
            index_after_header + 1) + 76] == '\n'
