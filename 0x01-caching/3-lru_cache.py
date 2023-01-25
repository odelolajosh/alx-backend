#!/usr/bin/env python3
""" Least Recently Used caching """
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    LRUCache class is an implementation of LRU caching
    replacement policy.
    """
    def __init__(self):
        """ Initializes a cache object """
        super().__init__()
        self._lru = []  # tracks the access sequence of the keys

    def put(self, key, item):
        """ Adds an item in the cache """
        if key is None or item is None:
            return

        self.__update_lru(key)
        self.cache_data[key] = item

    def get(self, key):
        """ Gets an item by key """
        if key in self.cache_data:
            self.__update_lru(key)
        return self.cache_data.get(key, None)

    def __update_lru(self, key):
        """ Updates the LRU list """
        if key in self._lru:
            self._lru.remove(key)
        elif len(self._lru) + 1 > BaseCaching.MAX_ITEMS:
            last_key = self._lru.pop(0)
            del self.cache_data[last_key]
            print("DISCARD:", last_key)

        self._lru.append(key)
