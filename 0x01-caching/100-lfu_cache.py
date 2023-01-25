#!/usr/bin/env python3
""" Least Frequently Used caching """
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    LFUCache class is an implementation of LFU caching
    replacement policy.
    """
    def __init__(self):
        """ Initializes a cache object """
        super().__init__()
        self._lfu = {}

    def put(self, key, item):
        """ Adds an item in the cache """
        if key is None or item is None:
            return

        self.__update_lfu(key)
        self.cache_data[key] = item

    def get(self, key):
        """ Gets an item by key """
        if key in self.cache_data:
            self.__update_lfu(key)
        return self.cache_data.get(key, None)

    def __update_lfu(self, key):
        """ Updates the LFU list """
        if key in self._lfu:
            self._lfu[key] += 1
        else:
            if len(self._lfu) + 1 > BaseCaching.MAX_ITEMS:
                lfu = min(self._lfu, key=lambda x: self._lfu[x])
                del self.cache_data[lfu]
                del self._lfu[lfu]
                print("DISCARD:", lfu)
            self._lfu[key] = 1
