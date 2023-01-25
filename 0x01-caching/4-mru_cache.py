#!/usr/bin/env python3
""" Most Recently Used caching """
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    MRUCache class is an implementation of MRU caching
    replacement policy.
    """
    def __init__(self):
        """ Initializes a cache object """
        super().__init__()
        self._mru = []  # tracks the access sequence of the keys

    def put(self, key, item):
        """ Adds an item in the cache """
        if key is None or item is None:
            return

        self.__update_mru(key)
        self.cache_data[key] = item

    def get(self, key):
        """ Gets an item by key """
        if key in self.cache_data:
            self.__update_mru(key)
        return self.cache_data.get(key, None)

    def __update_mru(self, key):
        """ Updates the MRU list """
        if key in self._mru:
            self._mru.remove(key)
        elif len(self._mru) + 1 > BaseCaching.MAX_ITEMS:
            last_key = self._mru.pop()
            del self.cache_data[last_key]
            print("DISCARD:", last_key)

        self._mru.append(key)
