from flask import Flask, request, current_app, make_response, redirect, abort, render_template, g, jsonify
from flask.ext.httpauth import HTTPBasicAuth
from models import User
from app import app


auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(email, password):
    if email == '':
        return False
    user = User.objects.get_or_404(email=email,password=password)
    if not user:
        return False
    g.current_user = user
    g.token_used = False
    return True

@auth.error_handler
def auth_error():
    message = 'Invalid credentials'
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    return response

@app.route('/')
@auth.login_required
def index():
    return 'hello'      #render_template('index.html')


@app.route('/baidu')
def redirect_baidu():
    abort(504)
    return redirect('http://www.baidu.com')

if __name__ == '__main__':
    #app.debug = True
    app.run('0.0.0.0')

