from operations import operations
import xml.etree.ElementTree as ET

class parse_xml:
    def parse_metadata(xml_body):
        root = ET.fromstring(xml_body)
        acsURls = []
        singleSignOnService = []
        singleLogoutService = []
        certificates = []
        acs_urls_index = 1
        certificate_index = 1
        single_logout_service_index = 1
        single_signon_service_index = 1
        entityID = None

        for child in root.findall("."):
            if child.tag.__contains__("EntityDescriptor"):
                entityID = child.attrib['entityID']

        for child in root.findall(".//"):
            splitdata = ""
            if child.tag.__contains__("X509Certificate"):
                certificate_data = child.text.replace(" ", "")
                data = operations.format_certificate(certificate_data)
                certificates.append({
                    "index": certificate_index,
                    "content": data
                })
                certificate_index + 1

            elif child.tag.__contains__("AssertionConsumerService"):
                acsURls.append({
                    "index": acs_urls_index,
                    "url": child.attrib['Location'],
                    "binding": child.attrib['Binding']
                })
                acs_urls_index = acs_urls_index + 1

            elif child.tag.__contains__("SingleLogoutService"):
                singleLogoutService.append({
                    "index": single_logout_service_index,
                    "Url": child.attrib['Location'],
                    "Binding": child.attrib['Binding']
                })
                single_logout_service_index + 1
            elif child.tag.__contains__('SingleSignOnService'):
                singleSignOnService.append( {
                    "index": single_signon_service_index,
                    "url": child.attrib['Location'],
                    "binding": child.attrib['Binding']
                })
                single_signon_service_index + 1

        metadata =  {
            "entityId": entityID,
            "certificate": certificates,
            "acsUrls": acsURls ,
            "singleLogoutService": singleLogoutService,
            "singleSignonService": singleSignOnService
        }

        return metadata
    
    def format_metadata_with_certificate(xml_body):
        root = ET.fromstring(xml_body)
        for child in root.findall('.//'):
            if(child.tag.__contains__('X509Certificate')):
                certificate_data = child.text.replace(" ", "")
                data = operations.format_certificate(certificate_data)
                xml_content = xml_body.replace(child.text, data)
                return xml_content
            




