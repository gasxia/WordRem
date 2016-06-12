# -*- coding:utf-8 -*-
from flask import render_template, request, jsonify, url_for, redirect
from flask.ext.login import login_user, logout_user, login_required
from . import auth
from ..models import User, Word


@auth.route('/login', methods=['POST'])
def login():
    form = request.form
    email = form.get('email_log')
    password = form.get('password_log')
    try:
        user = User.objects.get(email=email)
    except:
        return jsonify(status="fail")
    if user is not None and user.verify_password(password):
        login_user(user)
        return jsonify(status="success", username=user.username)
    return jsonify(status="fail")


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@auth.route('/register', methods=['POST'])
def register():
    form = request.form
    email = form.get('email_reg')
    username = form.get('username_reg')
    password = form.get('password_reg')
    if User.objects(email=email).count() != 0:
        return jsonify(status="fail", error="此Email账号已被使用")
    if User.objects(username=username).count() != 0:
        return jsonify(status="fail", error="此用户名已被使用")
    try:
        user = User(email=email, username=username)
        user.password = password
        user.remainwords = Word.objects(tags=user.wordtag)
        user.save()
    except Exception as e:
        return jsonify(status="fail", error=e.message)
    return jsonify(status="success")

