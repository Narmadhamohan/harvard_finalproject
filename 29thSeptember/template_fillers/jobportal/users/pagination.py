from rest_framework.pagination import PageNumberPagination, CursorPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """Reusable page-based pagination for normal listing APIs."""
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50

    def get_paginated_response(self, data):
        return Response({
            'total_records': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next_page': self.get_next_link(),
            'previous_page': self.get_previous_link(),
            'results': data
        })

class ProfileListInfiniteScrollPagination(CursorPagination):
    """
    Cursor-based pagination (used for infinite scroll / load more).
    Uses encoded cursor instead of page numbers.
    """
    page_size = 5
    ordering = 'full_name'  # Sort newest first (you can change it per model)
    cursor_query_param = 'cursor'

    def get_paginated_response(self, data):
        return Response({
            'next_cursor': self.get_next_link(),
            'previous_cursor': self.get_previous_link(),
            'page_size': self.page_size,
            'results': data
        })

class InfiniteScrollPagination(CursorPagination):
    """
    Cursor-based pagination (used for infinite scroll / load more).
    Uses encoded cursor instead of page numbers.
    """
    page_size = 5
    ordering = '-posted_on'  # Sort newest first (you can change it per model)
    cursor_query_param = 'cursor'

    def get_paginated_response(self, data):
        return Response({
            'next_cursor': self.get_next_link(),
            'previous_cursor': self.get_previous_link(),
            'page_size': self.page_size,
            'results': data
        })

class ApplicatntInfiniteScrollPagination(CursorPagination):
    """
    Cursor-based pagination (used for infinite scroll / load more).
    Uses encoded cursor instead of page numbers.
    """
    page_size = 5
    ordering = '-applied_on'  # Sort newest first (you can change it per model)
    cursor_query_param = 'cursor'

    def get_paginated_response(self, data):
        return Response({
            'next_cursor': self.get_next_link(),
            'previous_cursor': self.get_previous_link(),
            'page_size': self.page_size,
            'results': data
        })
