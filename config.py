import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'jinrunsen'

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    MONGODB_SETTINGS = {'DB': 'wordrem'}


class ProductionConfig(Config):
    MONGODB_SETTINGS = {'DB': 'wordrem'}


class TestingConfig(Config):
    TESTING = True
    MONGODB_SETTINGS = {'DB': 'wordrem'}


config = {
    'dev': DevelopmentConfig,
    'test': TestingConfig,
    'pro': ProductionConfig,

    'default': DevelopmentConfig
}