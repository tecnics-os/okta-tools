from api_methods import saml
import requests
import xml.etree.ElementTree as ET
import sys
sys.path.append("../api")
class TestAppMethods:
    API_URL = "http://127.0.0.1:5000/api"
    PARSE_METADATA_URL = "{}/parseMetadata".format(API_URL)
    CERTIFICATE_URL = '{}/certificateWithHeader'.format(API_URL)
    FORMAT_CERTIFICATE_URL = '{}/formatCertificate'.format(API_URL)
    UPLOAD_METDATA_URL = '{}/uploadMetadata'.format(API_URL)
    VALIDATE_ENTITYID_URL = '{}/validateEntityId'.format(API_URL)
    urls = [PARSE_METADATA_URL, CERTIFICATE_URL, FORMAT_CERTIFICATE_URL, UPLOAD_METDATA_URL, VALIDATE_ENTITYID_URL]
    
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
        count = 0;
        while count < len(TestAppMethods.urls):
            assert TestAppMethods.get_url_test(TestAppMethods.urls[count]) == 200
            count += 1

    def test_parse_metadata(self):
        filename = "test.xml"
        xml_data = TestAppMethods.read_content_from_file(filename)
        metadata = saml.extract_xml_attributes(xml_data)
        r = requests.post(TestAppMethods.PARSE_METADATA_URL, data=xml_data)
        data = r.json()
        assert r.status_code == 200
        assert data == metadata

    def test_parse_metadata_error(self):
        filename = "logger.txt"
        xml_data = TestAppMethods.read_content_from_file(filename)
        data = TestAppMethods.get_xml_post_data(xml_data)
        assert data['error'] == 'Given data is not a valid metadata.'
    
    def test_entity_id_missing(self):
        filename = "entityIdMissing.xml"
        xml_data = TestAppMethods.read_content_from_file(filename)
        data = TestAppMethods.get_xml_post_data(xml_data)
        assert data['error']['entityID_error'] == 'Given file does not have any entityID.'
    
    def test_certificate_missing(self):
        filename = "certificatemissing.xml"
        xml_data = TestAppMethods.read_content_from_file(filename)
        data = TestAppMethods.get_xml_post_data(xml_data)
        assert data['error']['certificate_error'] == 'Given file does not have any certificate.'

    def test_sso_or_acs_url_missing(self):
        filename="acs_url_missing.xml"
        xml_data = TestAppMethods.read_content_from_file(filename)
        data = TestAppMethods.get_xml_post_data(xml_data)
        xml_data_in_string = str(xml_data)
        if(xml_data_in_string.__contains__('IDPSSODescriptor')):
            assert data['error']['sso_error'] == 'Given file does not have single sign on service url.'
        elif(xml_data_in_string.__contains__('SPSSODescriptor')):
            assert data['error']['acs_error'] == 'Given file does not have acs url.'
    
    def test_upload_metadata(self):
        f = open('test.xml')
        xml_data = f.read()
        r = requests.post(TestAppMethods.UPLOAD_METDATA_URL, data=xml_data)
        xml = saml.get_xml_content(xml_data)
        assert r.status_code == 200
        assert xml == r.json()
    
    def test_certificate_with_header(self):
        f = open("certificate.txt", "r")
        certificate_text = f.read()
        r = requests.post(TestAppMethods.CERTIFICATE_URL, data=certificate_text)
        formatted_certificate = saml.get_certificate_with_header(certificate_text)
        data = r.json()
        certificate_data = data['certificate']
        certificate_data_in_string = str(certificate_data)
        index_after_header = certificate_data_in_string.index('\n')
        assert r.status_code == 200
        assert certificate_data == formatted_certificate
        assert certificate_data_in_string.startswith('-----BEGIN CERTIFICATE-----')
        assert certificate_data_in_string.endswith('-----END CERTIFICATE-----\n')
        assert certificate_data_in_string[(index_after_header + 1) + 76 ] == '\n'



    
    

