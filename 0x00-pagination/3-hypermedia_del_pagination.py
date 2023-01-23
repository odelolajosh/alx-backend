#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """ Returns a hyper media pagination resilient to deletion. """
        indexed_dt = self.indexed_dataset()
        assert index is not None and index >= 0 and index <= max(indexed_dt)
        assert page_size is not None and page_size > 0

        data = []
        data_size = 0
        for i in range(index, index + page_size):
            if i in indexed_dt:
                data.append(indexed_dt[i])
                data_size += 1

        next_index = None
        if index + data_size <= max(indexed_dt):
            next_index = index + data_size

        page_info = {
            "index": index,
            "next_index": next_index,
            "page_size": data_size,
            "data": data
        }
        return page_info
