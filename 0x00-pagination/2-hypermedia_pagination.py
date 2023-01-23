#!/usr/bin/env python3
""" 2. Hypermedia pagination """
from typing import Tuple, List, Dict
import csv
import math


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """ Returns the a start index and an end index corresponding to
    the range of indexes to return in a list for those particular
    pagination parameters.
    """
    start_index = page_size * (page - 1)
    end_index = start_index + page_size
    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """ Return a list of lists of length page_size. """
        assert type(page) is int and type(page_size) is int
        assert page > 0 and page_size > 0

        start_index, end_index = index_range(page, page_size)
        data = self.dataset()
        if start_index >= len(data):
            return []
        return data[start_index:end_index]
    
    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """ Returns a hyper media pagination """
        data = self.get_page(page, page_size)
        total_pages = math.ceil(len(self.dataset()) / page_size)
        return {
            "page_size": len(data),
            "page": page,
            "data": data,
            "next_page": page + 1 if page < total_pages else None,
            "prev_page": page - 1 if page > 1 else None,
            "total_pages": total_pages
        }
