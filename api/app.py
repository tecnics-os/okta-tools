from database import database
from api_methods import saml
import sys

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
        metadata = saml.extract_xml_attributes()
        return metadata

    @app.route("/api/certificateWithHeader", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate_with_header():
        certificate = saml.get_certificate_with_header()
        return {"certificate": certificate}

    @app.route("/api/formatCertificate", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate():
        certificate = saml.format_certificate()
        return {"certificate": certificate}

    @app.route("/api/uploadMetadata", methods=['POST', 'GET'])
    @cross_origin()
    def xml_parse():
        xml = saml.get_xml_content()
        return {
            "content": xml['xml-content'],
            "error": xml['error']
        }

    @app.route("/api/validateEntityId", methods=['POST', 'GET'])
    @cross_origin()
    def validate_entity_id():
        signOnUrl = saml.validate_entity_id()
        return {"signOnUrl": signOnUrl}

    @app.before_first_request
    def init_database():
        database.init_table()


if __name__ == "__main__":
    app.run()
