from logging import error
import xml.etree.ElementTree as ET
import urllib3

class parse_xml:
    def parse_metadata(xml_body):
        acsURls = []
        singleSignOnService = []
        singleLogoutService = []
        certificates = []
        entityID = []
        entityID_index = 1
        certificate_index = 1
        acsUrl_index = 1
        single_logout_service_index = 1
        single_signon_service_index = 1
        error=""
        root = ET.fromstring(xml_body)
        for child in root.findall("."):
            if child.tag.__contains__("EntityDescriptor"):
                entityid  = None
                if(child.attrib.__contains__('entityID')):
                    entityid = child.attrib['entityID']
                else:
                    error = "Given Xml does not have entityID."
            entityID.append({
                "index": str(entityID) + "entityId",
                "content": entityid
            })
            entityID_index = entityID_index + 1

        for child in root.findall(".//"):

            if child.tag.__contains__("X509Certificate"):
                certificate_data = child.text.replace(" ", "")
                certificate_data = parse_xml.format_certificate(certificate_data)
                certificates.append({
                    "index": str(certificate_index) + "certificate",
                    "content": certificate_data
                })
                certificate_index += 1


            if child.tag.__contains__("AssertionConsumerService"):
                url = child.attrib['Location']
                binding = child.attrib['Binding']
                acsURls.append({
                    "index": str(acsUrl_index) + "acs_url",
                    "url": url,
                    "binding": binding
                })
                acsUrl_index += 1

            if child.tag.__contains__("SingleLogoutService"):
                singleLogoutService.append({
                    "index": str(single_logout_service_index) + "SLO",
                    "Url": child.attrib['Location'],
                    "Binding": child.attrib['Binding']
                })
                single_logout_service_index += 1

            if child.tag.__contains__('SingleSignOnService'):
                singleSignOnService.append( {
                    "index": str(single_signon_service_index) + "SSO",
                    "url": child.attrib['Location'],
                    "binding": child.attrib['Binding']
                })
                single_signon_service_index += 1

        metadata =  {
            "entityId": entityID,
            "certificate": certificates,
            "acsUrls": acsURls ,
            "singleLogoutService": singleLogoutService,
            "singleSignonService": singleSignOnService,
            "error": error
        }

        return metadata

    def format_metadata_with_certificate(xml_body):
        root = ET.fromstring(xml_body)
        for child in root.findall('.//'):
            if(child.tag.__contains__('X509Certificate')):
                certificate_data = child.text
                data = parse_xml.format_certificate(certificate_data)
                xml_content = xml_body.replace(child.text, data)
                return xml_content


    def decode_request_body_to_string(request_body):
        request_body_in_string = str(request_body.decode('UTF-8'))
        return request_body_in_string

    def get_xml_body(request_body_in_string):
        if(request_body_in_string.startswith("http")):
            http = urllib3.PoolManager()
            r = http.request('GET', request_body_in_string)
            data = r.data
            xml_body = str(data.decode('UTF-8'))

        else:
            xml_body = request_body_in_string

        return xml_body

    def format_certificate(certificate_in_string):

        certificate_with_no_whitespaces = certificate_in_string.replace(" ", "")
        certificate_with_no_newline_tag = certificate_with_no_whitespaces.replace("\n", "")
        counter = 0
        certificate_length = len(certificate_with_no_newline_tag)
        formatted_certificate = ""
        while (counter <= certificate_length):
            formatted_certificate = formatted_certificate + certificate_with_no_newline_tag[counter: counter + 76] + "\n"
            counter = counter + 76
        return formatted_certificate
