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
            error = None
            entityID_error=""
            certificate_error=""
            sso_error=""
            acs_error=""
            metadata=""

            if(not xml_body.__contains__('entityID')):
                entityID_error = "Given file does not have any entityID."
            elif(not xml_body.__contains__('X509Certificate')):
                certificate_error += "Given file does not have any certificate."

            if(xml_body.__contains__('IDPSSODescriptor')):
                if(not xml_body.__contains__('SingleSignOnService')):
                    sso_error += "Given file does not have single sign on service url."
                error = {
                    "entityID_error": entityID_error,
                    "certificate_error": certificate_error,
                    "sso_error": sso_error
                }
                if(error['entityID_error'] == "" or error['certificate_error'] == "" or error['sso_error'] == "" ):
                    metadata = parse_xml.parse_metadata(xml_body)

            elif(xml_body.__contains__('SPSSODescriptor')):
                if(not xml_body.__contains__('AssertionConsumerService')):
                    acs_error += "Given file does not have acs url."
                error = {
                    "entityID_error": entityID_error,
                    "certificate_error": certificate_error,
                    "acs_error": acs_error
                }
                if(error['entityID_error'] == "" or error['certificate_error'] == "" or error['acs_error'] == "" ):
                    metadata = parse_xml.parse_metadata(xml_body)

            elif(not xml_body.__contains__('SPSSODescriptor') or xml_body.__contains__('IDPSSODescriptor')):
                error = "Given data is not a valid metadata."

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
            footer= "-----END CERTIFICATE-----\n"
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
            return "Invalid request"

    def get_xml_content():
        if request.method == 'POST':
            request_body = request.get_data()
            xml_body_in_string = parse_xml.decode_request_body_to_string(request_body)
            xml_body = parse_xml.get_xml_body(xml_body_in_string)
            xml_content = None
            error = ""
            metadata = ""
            if(xml_body.startswith("<") and xml_body.endswith(">") and  xml_body.__contains__('entityID') and xml_body.__contains__('X509Certificate') and (xml_body.__contains__('SingleSignOnService') or xml_body.__contains__('AssertionConsumerService'))):
                entityID = ""
                signOnUrl = ""
                metadata = parse_xml.parse_metadata(xml_body)
                entityID = str(metadata['entityId'][0]['content'])
                sql_query = ""
                if(metadata['singleSignonService'] == []):
                    acsUrl = str(metadata['acsUrls'][0]['url'])
                    sql_query = "INSERT INTO metadata(entityId, signOnUrl) select \'" + entityID + "\', \'" + acsUrl + "\' where not exists (select 1 from metadata where entityID = \'" + entityID + "\' and signOnUrl = \'" + acsUrl + "\')"
                else:
                    signOnUrl = str(metadata['singleSignonService'][0]['url'])
                    sql_query = "INSERT INTO metadata(entityId, signOnUrl) select \'" + entityID + "\', \'" + signOnUrl + "\' where not exists (select 1 from metadata where entityID = \'" + entityID + "\' and signOnUrl = \'" + signOnUrl + "\')"


                xml_content = parse_xml.format_metadata_with_certificate(xml_body)
                database.execute_sql_query(sql_query)
            else:
                if(not xml_body.__contains__('entityId')):
                        error += "Given file does not have Entity ID.\n"
                elif(not xml_body.__contains__('X509Certificate')):
                    error += "Given file does not have certificate.\n"

                if(xml_body.__contains__('IDPSSODescriptor')):
                    if(not xml_body.__contains__('singleSignonService')):
                        error += "Given file does not have single sign on url.\n"

                elif(xml_body.__contains__('SPSSODescriptor')):
                    if(not xml_body.__contains__('AssertionConsumerService')):
                        error += "Given file does not have acs url.\n"
                else:
                    error = "Given file is not a valid metadata file"

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
