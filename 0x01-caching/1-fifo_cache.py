#!/usr/bin/python3
""" FIFO caching """
from collections import OrderedDict
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFOCache class """

    def __init__(self):
        """ Initializes a cache object """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """ Add an item in the cache """
        if key and item:
            self.cache_data[key] = item

        if len(self.cache_data) > self.MAX_ITEMS:
            key, _ = self.cache_data.popitem(False)
            print("DISCARD: ", key)

    def get(self, key):
        """ Get an item by key """
        return self.cache_data.get(key, None)
