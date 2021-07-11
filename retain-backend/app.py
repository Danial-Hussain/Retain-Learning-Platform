from logging import info
from flask import Flask, abort
from flask.globals import request
from search import PodcastEngine
import psycopg2
import time
import json
import os

app = Flask(__name__)

app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True

# Postgres DB Connection
DB_NAME = os.environ.get("PG_DB")
DB_USER = os.environ.get("PG_USER")
DB_PASS = os.environ.get("PG_PASS")

# ListenNotes API
API_KEY = os.environ.get('API_KEY')

searchEngine = PodcastEngine(API_KEY)

with open("query.json") as jfile:
    queries = json.load(jfile)

# Establish Connection
tries = 10
while tries >= 0:
    try:
        db_conn = psycopg2.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port="5432",
            host="database",
        )
        break
    except:
        tries -= 1
        time.sleep(1)
        print("Trying again...")


@app.route("/api", methods=["GET"])
def home():
    return "<h1>LearningPlatform REST API</h1>"

@app.route("/topics", methods=["GET"])
def topics():
    with db_conn.cursor() as cursor:
        try:
            cursor.execute("""
                SELECT
                    DISTINCT info_topic
                FROM info;
            """)
            return json.dumps(cursor.fetchall(), indent=1)
        except:
            abort(400)

@app.route("/mediums", methods=["GET"])
def mediums():
    with db_conn.cursor() as cursor:
        try:
            cursor.execute("""
                SELECT
                    DISTINCT info_medium
                FROM info;
            """)
            return json.dumps(cursor.fetchall(), indent=1)
        except:
            abort(400)

@app.route("/sources", methods=["GET"])
def sources():
    with db_conn.cursor() as cursor:
        try:
            cursor.execute("""
                SELECT 
                    DISTINCT info_source
                FROM info;
            """)
            return json.dumps(cursor.fetchall(), indent=1)
        except:
            abort(400)

@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    info_topic = str(data["topicChoice"])
    info_medium = str(data["mediumChoice"])
    info_source = str(data["sourceChoice"])
    info_fact = str(data["factChoice"])
    info_confidence_level = int(data["confidenceChoice"][0])
    with db_conn.cursor() as cursor:
        try:
            cursor.execute("""
                INSERT INTO info (info_topic, info_medium,
                                  info_source, info_fact, 
                                  info_confidence_level)
                    VALUES (%s, %s, %s, %s, %s)
                """, (info_topic, info_medium, info_source,
                      info_fact, info_confidence_level)
            )
            db_conn.commit()
        except:
            abort(400)

@app.route("/episodes", methods=["GET"])
def episodes():
    episodes, seen = [], set()
    try:
        for searchField in queries:
            queryStrings = queries[searchField]['Query']
            category = queries[searchField]['Category']
            for query in queryStrings:
                tmp = searchEngine.queryTopic(
                    topic = query,
                    category = category
                )
                for episode in tmp:
                    episodeID = episode.url
                    if episodeID in seen:
                        continue
                    seen.add(episodeID)
                    episodes.append(episode.jsonify())
        jsonResult = json.dumps(episodes)
        return jsonResult
    except:
        abort(400)

@app.route("/recommendation/<id>", methods=["GET"])
def recommendation(id):
    try:
        episodes = searchEngine.queryRecommendations(id)
        episodes = [episode.jsonify() for episode in episodes]
        return json.dumps(episodes)
    except:
        abort(400)

@app.route("/episode/<query>/<category>", methods=["GET"])
def episode(query, category):
    try:
        episodes = searchEngine.queryTopic(
            topic = query,
            category = category
        )
        episodes = [episode.jsonify() for episode in episodes]
        return json.dumps(episodes)
    except:
        abort(400)

@app.route("/submitPodcast", methods=["POST"])
def submitPodcast():
    data = request.get_json()
    title = str(data['Title'])
    publisher = str(data['Publisher'])
    category = str(data['Category'])
    url = str(data['URL'])
    description = str(data['Description'])[0:999]
    duration = int(data['Duration'])
    rating = int(data['Rating'])
    with db_conn.cursor() as cursor:
        try:
            cursor.execute("""
                INSERT INTO episodes (episode_title, episode_publisher,
                                      episode_category, episode_url,
                                      episode_description, episode_duration,
                                      episode_rating)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (title, publisher, category, url,
                      description, duration, rating)
            )
            db_conn.commit()
            print('ye')
        except:
            abort(400)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)