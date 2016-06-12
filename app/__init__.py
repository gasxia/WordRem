# -*- coding:utf-8 -*-
import sys
from flask import Flask
from flask.ext.mongoengine import MongoEngine
from flask.ext.login import LoginManager
from config import config

login_manager = LoginManager()
login_manager.session_protection = 'basic'
login_manager.login_view = 'auth.login'

db = MongoEngine()


def create_app(config_name):
    reload(sys)
    sys.setdefaultencoding("utf-8")
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    login_manager.init_app(app)

    from .main import main as main_blueprint
    from .auth import auth as auth_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app
