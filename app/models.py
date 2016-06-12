from app import db
from flask import current_app
from flask.ext.login import UserMixin, AnonymousUserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from werkzeug.security import generate_password_hash, check_password_hash
from . import login_manager


class Mean(db.EmbeddedDocument):
    pos = db.StringField(required=True)
    mean = db.StringField(required=True)


class Note(db.EmbeddedDocument):
    user = db.ReferenceField('User')
    content = db.StringField(required=True)


class Exp(db.EmbeddedDocument):
    eng = db.StringField(required=True)
    chn = db.StringField(required=True)


class Word(db.Document):
    name = db.StringField(required=True)
    means = db.EmbeddedDocumentListField(Mean)
    tags = db.ListField(db.StringField(max_length=30))
    notes = db.EmbeddedDocumentListField(Note)
    exps = db.EmbeddedDocumentListField(Exp)

    def to_json(self):
        return{
            'id': str(self.id),
            'name': self.name,
            'means': [{'pos': x.pos, 'mean': x.mean} for x in self.means ],
            'notes': [{
                'user': x.user,
                'content': x.content
            } for x in self.notes],
            'exps': [{
                'eng': x.eng,
                'chn': x.chn
            } for x in self.exps]
        }


class HisWords(db.EmbeddedDocument):
    word = db.ReferenceField(Word)
    date = db.DateTimeField()


class User(UserMixin, db.Document):
    email = db.StringField(required=True, unique=True)
    username = db.StringField(required=True, unique=True)
    password_hash = db.StringField(required=True)
    wordtag = db.StringField(required=True, default='siji')
    daycount = db.IntField(default=50)
    hiswords = db.EmbeddedDocumentListField(HisWords)
    curwords = db.ListField(db.ReferenceField(Word))
    remainwords = db.ListField(db.ReferenceField(Word))
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self,password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expiration):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id':self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return User.objects.get_or_404(id=data['id'])

    def to_json(self):
        pass


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_administrator(self):
        return False


@login_manager.user_loader
def load_user(user_id):
    return User.objects.get_or_404(id=user_id)