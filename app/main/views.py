from datetime import date
from flask import render_template, session, redirect, url_for, jsonify, request
from flask.ext.login import current_user
from random import sample
from . import main
from ..models import User, Word, HisWords


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@main.route('/wordlist', methods=['GET', 'POST'])
def getwordlist():
    try:
        if not current_user.curwords:
            dc = current_user.daycount
            wlc = len(current_user.remainwords)
            current_user.curwords = sample(current_user.remainwords, wlc if dc > wlc else dc)
            current_user.save()
        wordlist = current_user.curwords
    except Exception as e:
        return jsonify(status="fail", error=e.message)
    #: trun wordList to json type
    return jsonify(status="success", wordlist=[word.to_json() for word in wordlist])


@main.route('/set', methods=['POST'])
def setting():
    try:
        form = request.form
        current_user.wordtag = form.get('wordtag')
        current_user.daycount = form.get('daycount')
        current_user.hiswords = []
        current_user.remainwords = Word.objects(tags=current_user.wordtag)
        current_user.save()
    except Exception as e:
        return jsonify(status="fail", error=e.message)
    return jsonify(status="success")


@main.route('/complete', methods=['GET'])
def complete():
    try:
        for word in current_user.curwords:
            current_user.remainwords.remove(word)
            current_user.hiswords.append(HisWords(word=word, date=date.today()))
        current_user.curwords = []
        current_user.save()
    except Exception as e:
        return jsonify(status="fail", error=e.message)
    return jsonify(status="success")
