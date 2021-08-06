from logging import error
from database import database
from parse_xml import parse_xml
from flask import request

class saml:
    def extract_xml_attributes():
        if request.method == 'POST':
            request_body = request.get_data()
            request_body_in_string = parse_xml.decode_request_body_to_string(request_body)
            xml_body = parse_xml.get_xml_body(request_body_in_string)
            metadata = parse_xml.parse_metadata(xml_body)
            error = None
            if(metadata['entityId'] == None):
                error = "Oops, entered url or file is not a valid metadata. Please check." 
            
            return {
                "metadata": metadata,
                "error": error

            } 
        else:
            return "Invalid request"

    def get_certificate_with_header():
        if request.method == 'POST':
            certificate_data = request.get_data()
            certificate_in_string = parse_xml.decode_request_body_to_string(certificate_data)
            formatted_certificate = parse_xml.format_certificate(certificate_in_string)
            header = "-----BEGIN CERTIFICATE-----\n"
            footer= "\n-----END CERTIFICATE-----"
            certificate_with_header = header + formatted_certificate + footer
            return certificate_with_header
        else:
            return "Invalid request"

    def format_certificate():
        if request.method == 'POST':
            certificate_data = request.get_data();
            cert_data_in_string = parse_xml.decode_request_body_to_string(certificate_data)
            format_cert = parse_xml.format_certificate(cert_data_in_string)
            return format_cert
        else:
            return "SORRY THE PAGE YOU ARE ACCESSING IS NOT ACCESSIBLE"

    def get_xml_content():
        if request.method == 'POST':
            request_body = request.get_data()
            xml_body_in_string = parse_xml.decode_request_body_to_string(request_body)
            xml_body = parse_xml.get_xml_body(xml_body_in_string)
            xml_content = None
            error = None
            if(xml_body.__contains__('entityID') & xml_body.__contains__('X509Certificate') & xml_body.__contains__('SingleSignOnService') ):
                metadata = parse_xml.parse_metadata(xml_body)
                entityID = ""
                signOnUrl = ""
                print()
                entityID = metadata['entityId']
                signOnUrl = metadata['singleSignonService'][0]['url']
                xml_content = parse_xml.format_metadata_with_certificate(xml_body)
                sql_query = "INSERT INTO metadata(entityId, signOnUrl) select \'" + entityID + "\', \'" + signOnUrl + "\' where not exists (select 1 from metadata where entityID = \'" + entityID + "\' and signOnUrl = \'" + signOnUrl + "\')"
                database.execute_sql_query(sql_query)
                
            else:
                error = "XML Parsing error. Please check and re-upload metadata."
            xml =  {
                "xml-content": xml_content,
                "error": error
            }
            return xml

        else:
            return "GET REQ NOT ALLOWED"

    def validate_entity_id():
        if request.method == 'POST':
            request_body = request.get_data()
            entityId = parse_xml.decode_request_body_to_string(request_body)
            sql_query = "select signOnUrl from metadata where entityId=\'" + entityId + "\'";
            signOnUrl = ""
            cursor = database.execute_sql_query(sql_query)
            for row in cursor:
                signOnUrl = row[0]
            
            return signOnUrl

        else:
            return "404 ERROR"

