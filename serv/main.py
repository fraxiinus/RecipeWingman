from flask import Flask, jsonify, make_response
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.oauth2 import service_account
import requests
import json

app = Flask(__name__)

tasks = [
    {
        'id': 1,
        'title': 'Buy groceries',
        'description': 'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': 'Learn Python',
        'description': 'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@app.route('/')
def index():
    return "Hello World!"

@app.route('/tasks', methods=['GET'])
def get_tasks():
	return jsonify({'tasks': tasks})
    
@app.route('/process_input/<string:text>', methods=['GET'])
def entities_text(text):
    """Detects entities in the text."""
    client = language.LanguageServiceClient()

    # Instantiates a plain text document.
    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects entities in the document. You can also analyze HTML with:
    #   document.type == enums.Document.Type.HTML
    entities = client.analyze_entities(document).entities

    # entity types from enums.Entity.Type
    entity_type = ('UNKNOWN', 'PERSON', 'LOCATION', 'ORGANIZATION',
                   'EVENT', 'WORK_OF_ART', 'CONSUMER_GOOD', 'OTHER')
    
    ingredients = []
    out = ""

    for entity in entities:
        ingredients.append(entity.name)
        out += entity.name + ", "
        #print('=' * 20)
        #print(u'{:<16}: {}'.format('name', entity.name))
        #print(u'{:<16}: {}'.format('type', entity_type[entity.type]))
        #print(u'{:<16}: {}'.format('metadata', entity.metadata))
        #print(u'{:<16}: {}'.format('salience', entity.salience))
        #print(u'{:<16}: {}'.format('wikipedia_url',
        #      entity.metadata.get('wikipedia_url', '-')))
    
    return out
    
#@app.route('/get_auth', methods=['GET'])
#def auth():
#    post_url = 'https://login.microsoftonline.com/1318d57f-757b-45b3-b1b0-9b3c3842774f/oauth2/token'
#    headers = {
#        'content-type': 'application/x-www-form-urlencoded',
#    }
#    
#
#    r = requests.post(post_url, data=data, headers=headers)
#    print(r.text)
#    return r.text

@app.route('/search/<string:query>', methods=['GET'])
def search(query):
    get_url = 'https://wegmans-es.azure-api.net/productpublic/products/search?criteria=' + query
    data = json.load(open('WegmansKeys.json'))
    wegmans_auth = data["access_token"]
    primary_key = data["primary_key"]
    headers = {
        'product-subscription-key': primary_key,
        'Authorization': "Bearer " + wegmans_auth
    }

    r = requests.get(get_url, headers=headers)
    return r.text

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': '404: Bad time to get lost, FRIEND!'}), 404)

if __name__ == '__main__':
    app.run(debug=True)