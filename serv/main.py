from flask import Flask, jsonify, make_response
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.oauth2 import service_account
import requests
import json

app = Flask(__name__)

class Product:
    def __init__(self, name, price, image, velocity):
        self.name = name
        self.price = price
        self.image = image
        self.velocity = velocity

class WegmansClass:
    def __init__(self):
        data = json.load(open('WegmansKeys.json'))
        self.key = data['primary_key']
        self.auth = data['access_token']

    def GetSKUs(self, query):
        get_url = 'https://wegmans-es.azure-api.net/productpublic/products/search?criteria=' + query
        headers = {
            'product-subscription-key': self.key,
            'Authorization': "Bearer " + self.auth
        }
        r = requests.get(get_url, headers=headers)
        rd = json.loads(r.text)
        try:
            results = rd['Results']
        except KeyError:
            return []
        skus = []
        for i in range(1):
            skus.append(results[i]['ItemNumber'])
        return skus

    def GetProduct(self, sku):
        get_price_url = 'https://wegmans-es.azure-api.net/pricepublic/pricing/current_prices/' + str(sku) + "/73"
        get_velocity_url = 'https://wegmans-es.azure-api.net/productpublic/productavailability/' + str(sku) + "/73"
        get_image_url = 'https://wegmans-es.azure-api.net/productpublic/products/' + str(sku)
        #print(self.key)
        #print(self.auth)
        headers = {
            'Price-Subscription-Key': self.key,
            'Authorization': "Bearer " + self.auth
        }
        r = requests.get(get_price_url, headers=headers)
        try:
            price = json.loads(r.text)[0]['Price']
            name = json.loads(r.text)[0]['Description']
        except KeyError:
            price = "N/A"
            name = "N/A"
        #print(str(price) + name)

        headers = {
            'Product-Subscription-Key': self.key,
            'Authorization': "Bearer " + self.auth
        }
        r = requests.get(get_image_url, headers=headers)
        #print(r.text)
        try:
            image = json.loads(r.text)['TradeIdentifierConfigurations'][0]['TradeIdentifiers'][0]['Images'][0]['Url']
        except KeyError:
            image = "N/A"
        
        r = requests.get(get_velocity_url, headers=headers)
        try:
            velocity = json.loads(r.text)[0]['Velocity']
        except KeyError:
            velocity = "N/A"

        return Product(name, price, image, velocity)


@app.route('/')
def index():
    return "Hello World!"

@app.route('/get_entries/<string:text>', methods=['GET'])
def get_entries(text):
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

    out = ""
    for entity in entities:
        out += entity.name + ', '
    return out

@app.route('/get_products/<string:text>', methods=['GET'])
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
    products = [] 
    wegmans = WegmansClass()

    for entity in entities:
        ingredients.append(entity.name)
        out += entity.name + '\n'
        weg_sku = wegmans.GetSKUs(entity.name)

        prod = []

        for x in weg_sku:
            r = wegmans.GetProduct(x)
            prod.append(r)
            out += r.name + ", " + str(r.price) + ", " + str(r.image) + str(r.velocity) + '#'

        products.append(prod)

        #print('=' * 20)
        #print(u'{:<16}: {}'.format('name', entity.name))
        #print(u'{:<16}: {}'.format('type', entity_type[entity.type]))
        #print(u'{:<16}: {}'.format('metadata', entity.metadata))
        #print(u'{:<16}: {}'.format('salience', entity.salience))
        #print(u'{:<16}: {}'.format('wikipedia_url',
        #      entity.metadata.get('wikipedia_url', '-')))

    for x in ingredients:
        print(x + '\n')

    for x in products:
        for y in x:
            print(y.name)
            print(y.price)
            print(y.velocity)
            print(y.image)
            print('\t')

    js = json.dumps(products, default=lambda o: o.__dict__)
    
    return jsonify({"results": json.loads(js)})

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
    rd = json.loads(r.text)
    results = rd['Results']
    links = rd['Links']
    return jsonify({'results': results, 'links': links})
    return r.text

@app.route('/priceof/<int:sku>', methods=['GET'])
def priceof(sku):
    wegmans = WegmansClass()
    return float(wegmans.GetPrice(sku))

@app.route('/newkey')
def newkey():
    post_url = 'https://login.microsoftonline.com/1318d57f-757b-45b3-b1b0-9b3c3842774f/oauth2/token'
    headers = {
        'content-type': 'application/x-www-form-urlencoded'
    }
    data = 'client_id=24960d97-4fbe-433d-ab8a-efeb89aa524e&client_secret=A8N7VeeCdFD5N4OxeQT1gFaXNStrxieEplYl3SYdxTs=&grant_type=client_credentials&resource=https://wegmans-es.azure-api.net'
    r = requests.post(post_url, headers=headers, data=data)
    rd = json.loads(r.text)
    print(rd)
    return rd['access_token']

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': '404: Bad time to get lost, FRIEND!'}), 404)

if __name__ == '__main__':
    app.run(debug=True)