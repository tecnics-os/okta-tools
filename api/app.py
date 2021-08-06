from api import saml
import sys

from flask import Flask
from flask_cors import CORS, cross_origin

sys.path.append(".")
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

class saml_tool():
    @app.route("/parse_metadata", methods=['POST', 'GET'])
    @cross_origin()
    def xml_parser():
        metadata = saml.extract_xml_attributes()
        return metadata
    
    @app.route("/certificateWithHeader", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate_with_header():
        certificate = saml.get_certificate_with_header()
        return {"certificate": certificate}
    
    @app.route("/formatCertificate", methods=['POST', 'GET'])
    @cross_origin()
    def format_certificate():
        certificate = saml.format_certificate()
        return {"certificate": certificate }

    @app.route("/uploadmetadata", methods=['POST', 'GET'])
    @cross_origin()
    def xml_parse():
        xml_content = saml.get_xml_content()
        return { "content": xml_content}
    
    @app.route("/validateEntityId", methods=['POST', 'GET'])
    @cross_origin()
    def validate_entity_id():
        signOnUrl = saml.validate_entity_id()
        return {"signOnUrl": signOnUrl}

if __name__ == "__main__":
    app.run()