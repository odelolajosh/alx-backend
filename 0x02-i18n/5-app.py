#!/usr/bin/env python3
""" 2. get local from request """
from flask import Flask, render_template, request, g
from flask_babel import Babel


class Config:
    """ Config class for app """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user(login_as: str) -> dict:
    """ Get user from users """
    return users.get(int(login_as), None)


@app.before_request
def before_request() -> None:
    """ Before request """
    user = get_user(request.args.get('login_as'))
    if user:
        g.user = user


@babel.localeselector
def get_locale() -> str:
    """ Get locale from request """
    query_strings = request.query_string.decode('utf-8').split('&')
    query = {k: v for k, v in [i.split('=') for i in query_strings]}
    if 'locale' in query and query['locale'] in app.config["LANGUAGES"]:
        return query['locale']
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/")
def welcome() -> str:
    """ / page """
    return render_template('5-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
