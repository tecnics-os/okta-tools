import sqlite3
import xml.etree.ElementTree as ET
from os import error, stat

import urllib3
from flask import Flask, request
from flask_cors import CORS, cross_origin
import config
import logging

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
database_name = config.database
log_file= config.log_file

class saml:

    def database_init():
        sql_query = '''CREATE TABLE IF NOT EXISTS metadata(
        entityId varchar(255) primary key,
        signOnUrl varchar(255));'''
        saml.execute_sql_query(sql_query)

    def execute_sql_query(sql_query):
        conn = sqlite3.connect(database_name)
        try:
            cursor = conn.execute(sql_query);
            conn.commit()
            return cursor
        except sqlite3.Error as err:
            f = open(log_file, "a")
            f.write(str(e))
            f.close()
        conn.close()

    def decode_request_body_to_string(request_body):
        request_body_in_string = str(request_body.decode('UTF-8'))
        return request_body_in_string

    def get_xml_body(request_body_in_string):
        if(request_body_in_string.startswith("http")):
            http = urllib3.PoolManager()
            r = http.request('GET', request_body_in_string)
            data = r.data
            xml_body = str(data.decode('UTF-8'))
            return xml_body
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

    @app.route("/parse_metadata", methods=['POST', 'GET'])
    @cross_origin()
    def saml_parser():
        if request.method == 'POST':
            request_body = request.get_data()
            request_body_in_string = saml.decode_request_body_to_string(request_body)
            xml_body = saml.get_xml_body(request_body_in_string)
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
                    data = saml.format_certificate(certificate_data)
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
        else:
            return "404-ERROR ONLY POST REQUEST IS ACCEPTED"


    @app.route("/certificateWithHeader", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate_with_header():
        if request.method == 'POST':
            certificate_data = request.get_data()
            certificate_in_string = saml.decode_request_body_to_string(certificate_data)
            formatted_certificate = saml.format_certificate(certificate_in_string)
            header = "-----BEGIN CERTIFICATE-----\n"
            footer= "\n-----END CERTIFICATE-----"
            certificate_with_header = header + formatted_certificate + footer
            return { "data": certificate_with_header}
        else:
            return "404-ERROR ONLY POST REQUEST IS ACCEPTED"

    @app.route("/formatCertificate", methods=['POST', 'GET'])
    @cross_origin()
    def format_cert():
        if request.method == 'POST':
            certificate_data = request.get_data();
            cert_data_in_string = saml.decode_request_body_to_string(certificate_data)
            format_cert = saml.format_certificate(cert_data_in_string)
            return format_cert
        else:
            return "SORRY THE PAGE YOU ARE ACCESSING IS NOT ACCESSIBLE"

    @app.route("/uploadmetadata", methods=['POST', 'GET'])
    @cross_origin()
    def xml_parse():
        if request.method == 'POST':
            request_body = request.get_data()
            xml_body_in_string = saml.decode_request_body_to_string(request_body)
            xml_body = saml.get_xml_body(xml_body_in_string)
            signOnUrl = ""
            entityID = ""
            error = None
            carbon_copy = ""
            xml_data = ""
            if(xml_body.__contains__('entityID') & xml_body.__contains__('X509Certificate')):
                formatted_certificate = "";
                root = ET.fromstring(xml_body)
                for child in root.findall('.//'):
                    if(child.tag.__contains__('X509Certificate')):
                        certificate_data = child.text.replace(" ", "")
                        data = saml.format_certificate(certificate_data)
                        xml_data = xml_body.replace(child.text, data)

                root = ET.fromstring(xml_body)
                for child in root.findall(".//"):
                    if child.tag.__contains__('SingleSignOnService'):
                        signOnUrl = child.attrib['Location']
                for child in root.findall("."):
                    if child.tag.__contains__("EntityDescriptor"):
                        entityID = child.attrib['entityID']

                sql_query = "INSERT INTO metadata(entityId, signOnUrl) select \'" + entityID + "\', \'" + signOnUrl + "\' where not exists (select 1 from metadata where entityID = \'" + entityID + "\' and signOnUrl = \'" + signOnUrl + "\')"
                saml.execute_sql_query(sql_query)

            else:
                error = "XML is invalid"

            resp = {
                "data": xml_data,
                "error": error
            }
            return resp;
        else:
            return "GET REQ NOT ALLOWED"

    @app.route("/validateEntityId", methods=['POST', 'GET'])
    @cross_origin()
    def validateEntityId():
        if request.method == 'POST':
            request_body = request.get_data()
            entityId = saml.decode_request_body_to_string(request_body)
            sql_query = "select signOnUrl from metadata where entityId=\'" + entityId + "\'";
            error = None
            signOnUrl = ""
            cursor = saml.execute_sql_query(sql_query)
            for row in cursor:
                signOnUrl = row[0]

            metadata = {
                    "data": signOnUrl,
                    "error": error
                }
            return metadata

        else:
            return "404 ERROR"

if __name__ == "__main__":
    saml.database_init()
    app.run()
