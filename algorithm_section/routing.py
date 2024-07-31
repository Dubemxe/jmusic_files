#/usr/bin/python3
'''Deployment route for testing'''
from flask import Flask, render_template, redirect, url_for
import webbrowser
app = Flask(__name__)



@app.route('/', strict_slashes=False)
def homepage():
    '''Home page'''
    return render_template('homepage.html')

@app.route('/searchpage', strict_slashes=False)
def search_page():
    '''Search return'''
    return render_template('searchpage.html')

@app.route('/authorize')
def authorize():
    '''Retrieves access token from the spotify api'''
    client_id = '7551c1408176449aaba62ef47bd91b80'
    redirect_uri = 'http://172.20.218.35:5000/searchpage'
    scopes = 'user-read-private user-read-email'

    authorization_url = f'https://accounts.spotify.com/authorize?client_id={client_id}&response_type=token&redirect_uri={redirect_uri}&scope={scopes}'

    # Open the authorization URL in the default web browser
    #webbrowser.open(authorization_url)

    return redirect(authorization_url)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
