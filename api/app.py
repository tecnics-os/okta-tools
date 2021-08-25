from base64 import encode
from database import database
from api_methods import saml
from api_methods import parse_xml
from hash_verifier import password_checker
from jwt_decoder import jwt_viewer
import sys
import ast
from flask import request
from flask import Flask
from flask_cors import CORS, cross_origin

sys.path.append(".")
app = Flask(__name__)
# app.config["APPLICATION_ROOT"] = "/api"
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class saml_tool():
    @app.route("/api/parseMetadata", methods=['POST', 'GET'])
    @cross_origin()
    def xml_parser():
        if request.method == 'POST':
            request_body = request.get_data()
            request_body_in_string = parse_xml.decode_request_body_to_string(request_body)
            metadata = saml.extract_xml_attributes(request_body_in_string)
            return metadata
        else:
            return "Invalid request"

        
    @app.route("/api/certificateWithHeader", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate_with_header():
        if request.method == 'POST':
            certificate_data = request.get_data()
            certificate_in_string = parse_xml.decode_request_body_to_string(certificate_data)
            certificate = saml.get_certificate_with_header(certificate_in_string)
            return {"certificate": certificate}
        else:
            return "Invalid request"

    @app.route("/api/formatCertificate", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate():
        if request.method == 'POST':
            certificate_data = request.get_data();
            cert_data_in_string = parse_xml.decode_request_body_to_string(certificate_data)
            certificate = saml.format_certificate(cert_data_in_string)
            return {"certificate": certificate}
        else:
            return "Invalid request"

    @app.route("/api/uploadMetadata", methods=['POST', 'GET'])
    @cross_origin()
    def xml_parse():
        if request.method == 'POST':
            request_body = request.get_data()
            xml_body_in_string = parse_xml.decode_request_body_to_string(request_body)
            xml = saml.get_xml_content(xml_body_in_string)
            return xml
        else:
            return "Invalid request"

    @app.route("/api/validateEntityId", methods=['POST', 'GET'])
    @cross_origin()
    def validate_entity_id():
        if request.method == 'POST':
            request_body = request.get_data()
            entityId = parse_xml.decode_request_body_to_string(request_body)
            signOnUrl = saml.validate_entity_id(entityId)
            return {"signOnUrl": signOnUrl}
        else:
            return "Invalid request"

    @app.route("/api/verifyPasswordHash", methods=['POST', 'GET'])
    @cross_origin()
    def verify_password_hash():
        if request.method == 'POST':
            request_json = request.get_json(force=True)
            status = password_checker.verify_password_hash(request_json)
            return status

        else:
            return "Invalid request"
        
    @app.route("/api/decodeJwtToken", methods=['POST', 'GET'])
    @cross_origin()
    def decode_jwt_token():
        if request.method == 'POST':
            req_body = request.get_json()
            encoded_token = req_body['encoded_token']
            data = jwt_viewer.decode_encoded_string(encoded_token)
            return data
        else:
            return "Invalid request"


    @app.before_first_request
    def init_database():
        database.init_table()


if __name__ == "__main__":
    app.run()
