from listennotes import podcast_api
from episode import Episode
import datetime
import json

class PodcastEngine:
    def __init__(self, key):
        """
        Initialize the PodcastEngine

        :param key: ListenNotes API Key
        :returns: None
        """
        self.client = podcast_api.Client(api_key=key)

    @staticmethod
    def timeWindow(timeWindow):
        """
        Calculates a day in unix time

        :param timeWindow: Number of days in the past
        :returns: Day in unix time
        """
        day = datetime.date.today() - datetime.timedelta(days = timeWindow)
        unix_time = day.strftime("%s")
        return unix_time

    def queryTopic(self, topic, category, pages = 1, timeWindow=0):
        """
        Discovers podcast episodes from ListenNotes API for a particular topic

        :param topic: The query to search for
        :param category: The category of the podcast episode
        :param pages: The number of pages to iterate through
        :param timeWindow: The starting date for the search
        :returns: Array of podcast episodes
        """
        published_after = timeWindow(timeWindow) if timeWindow != 0 else 0
        episodes = []
        for i in range(pages):
            response = self.client.search(
                q=topic,
                sort_by_date=1,
                type='episode',
                offset=i,
                published_after=published_after,
                only_in='title,description',
                region='us',
                language='English',
            )
            dictionary = response.json()
            for j, val in enumerate(dictionary['results']):
                episode = Episode(
                    title = val['title_original'],
                    publisher = val['podcast']['title_original'],
                    category = category,
                    url = val['listennotes_url'],
                    description = val['description_original'],
                    duration = val['audio_length_sec'],
                    id = val['id']
                )
                episodes.append(episode)
        return episodes

    def queryRecommendations(self, episodeOld):
        """
        Recommends podcast episodes given a podcast id

        :param podcast_Id: Listennotes id for a podcast episode
        :returns: Array of podcast episodes
        """
        response = self.client.fetch_recommendations_for_episode(
            id = episodeOld.id,
            safe_mode = 0
        )
        dictionary = response.json()
        episodes = []
        for i, val in enumerate(dictionary['recommendations']):
            episode = Episode(
                title = val['title'],
                publisher = val['publisher'],
                category = episodeOld.category,
                url = val['listennotes_url'],
                description = val['description'],
                duration = None
            )
            episodes.append(episode)
        return episodes