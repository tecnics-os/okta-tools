from api_methods import saml

class TestApiMethods:

    def test_format_certificate(self):
        certificate = "somerandomcertificatesomerandomcertificatesomerandomcertificatesomerandomcertificate"
        formatted_certificate = saml.format_certificate(certificate)
        assert formatted_certificate[76] == '\n'
    
    def test_get_xml_content(self):
        test_xml = '<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://www.okta.com/random"><md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:KeyDescriptor use="signing"><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data></ds:X509Data></ds:KeyInfo></md:KeyDescriptor><md:SingleSignOnService Binding="HTTP-POST" Location="sso-url"/></md:IDPSSODescriptor></md:EntityDescriptor>'
        xml = saml.get_xml_content(test_xml)
        assert xml['error'] == 'Given file does not have certificate.\n'