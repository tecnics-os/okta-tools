from parse_xml import parse_xml
from xml.etree import ElementTree as ET

class TestParseXml:
    def test_parse_xml(self):
        xml_data = '''<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://www.okta.com/random">
<md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
<md:KeyDescriptor use="signing">
<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
<ds:X509Data>
<ds:X509Certificate>some-random-certificate</ds:X509Certificate>
</ds:X509Data>
</ds:KeyInfo>
</md:KeyDescriptor>
<md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
<md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</md:NameIDFormat>
<md:SingleSignOnService Binding="HTTP-POST" Location="sso-url"/>
</md:IDPSSODescriptor>
</md:EntityDescriptor>'''
        metadata = parse_xml.parse_metadata(xml_data)
        assert metadata['entityId'][0]['content'] == 'http://www.okta.com/random'
        assert metadata['certificate'][0]['content'] == 'some-random-certificate\n'
        assert metadata['acsUrls'] == []
        assert metadata['singleLogoutService'] == []
        assert metadata['singleSignonService'][0]['url'] == "sso-url"
        assert metadata['singleSignonService'][0]['binding'] == "HTTP-POST"
        assert metadata['error'] == ''
    
    def test_format_metadata_with_certificate(self):
        xml_body = '''<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://www.okta.com/random">
                <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
                <md:KeyDescriptor use="signing">
                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                <ds:X509Certificate>xxxxxxxxxxbhbhbhbbhbhbhhbhbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbxxxxxxxxxxxxxxxxxxxxxxyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy</ds:X509Certificate>
                </ds:X509Data>
                </ds:KeyInfo>
                </md:KeyDescriptor>
                <md:SingleSignOnService Binding="HTTP-POST" Location="sso-url"/>
                </md:IDPSSODescriptor>
                </md:EntityDescriptor>'''
        xml_content = parse_xml.format_metadata_with_certificate(xml_body)
        root = ET.fromstring(xml_content)
        certificate = ""
        for child in root.findall(".//"):
            if(child.tag.__contains__('X509Certificate')):
                certificate = child.text

        assert certificate[76] == '\n'
        assert xml_body != xml_content

    def test_format_certificate(self):
       certificate = "somerandomcertificatesomerandomcertificatesomerandomcertificatesomerandomcertificatesomerandomcertificatesomerandomcertificate"
       get_certificate = parse_xml.format_certificate(certificate)
       assert get_certificate[76] == '\n'
    