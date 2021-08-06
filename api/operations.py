import urllib3

class operations:
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

        