import json

class Episode:
    def __init__(
        self, title, publisher, category,
        url, description, duration, id
    ):
        """
        Initialize the podcast episode

        :param title: Title of the episode
        :param publisher: Name of the publisher
        :param category: Category/Genre of episode
        :param url: Link to the podcast
        :param description: Description of the episode
        :param duration: Duration of the episode
        :returns: None
        """
        self.title = title
        self.publisher = publisher
        self.category = category
        self.url = url
        self.description = description 
        self.duration = duration
    
    def jsonify(self):
        """
        Convert Episode to JSON object

        :returns: python dictionary
        """
        hashmap = {
            'Title': self.title,
            'Publisher': self.publisher,
            'Category': self.category,
            'URL': self.url,
            'Description': self.description,
            'Duration': self.duration
        }
        return hashmap
        
    def __str__(self):
        return f"{self.title} - {self.publisher}"
    
    def __repr__(self):
        return f"{self.title} - {self.publisher}"