"""
Tests for third party auth middleware
"""
import mock
from django.contrib.messages.middleware import MessageMiddleware
from django.test.client import RequestFactory
from requests.exceptions import HTTPError

from third_party_auth.middleware import ExceptionMiddleware
from third_party_auth.tests.testutil import TestCase


class ThirdPartyAuthMiddlewareTestCase(TestCase):
    """Tests that ExceptionMiddleware is correctly redirected"""

    @mock.patch('django.conf.settings.MESSAGE_STORAGE', 'django.contrib.messages.storage.cookie.CookieStorage')
    def test_http_exception_redirection(self):
        """
        Test ExceptionMiddleware is correctly redirected to login page
        when PSA raises HttpError exception.
        """

        test_url = '/login'
        request = RequestFactory().get("dummy_url")
        exception = HTTPError()
        # Add error message for error in auth pipeline
        MessageMiddleware().process_request(request)
        response = ExceptionMiddleware().process_exception(
            request, exception
        )
        self.assertEqual(response.status_code, 302)
        target_url = response._headers['location'][1]
        self.assertTrue(target_url.endswith(test_url))
