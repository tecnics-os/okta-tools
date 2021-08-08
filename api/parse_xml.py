from logging import error
import xml.etree.ElementTree as ET
import urllib3

class parse_xml:
    def parse_metadata(xml_body):
        error = None
        acsURls = []
        singleSignOnService = []
        singleLogoutService = []
        certificates = []
        acs_urls_index = 1
        certificate_index = 1
        single_logout_service_index = 1
        single_signon_service_index = 1
        entityID = None
        try:
            root = ET.fromstring(xml_body)
            for child in root.findall("."):
                if child.tag.__contains__("EntityDescriptor"):
                    entityID = child.attrib['entityID']

            for child in root.findall(".//"):
                splitdata = ""
                if child.tag.__contains__("X509Certificate"):
                    certificate_data = child.text.replace(" ", "")
                    data = parse_xml.format_certificate(certificate_data)
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
        except Exception as e:
            print("Error: ",e)
            error = e
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
                certificate_data = child.text.replace(" ", "")
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
            formatted_certificate = formatted_certificate + certificate_with_no_newline_tag[counter: counter + 64] + "\n"
            counter = counter + 64
        return formatted_certificate

            




