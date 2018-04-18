from unittest import TestCase

from ..model_mixins import RetireUserByEmailMixin

class MockModelForRetirementTests(RetireUserByEmailMixin):

    def __init__(self):
        super(MockModelForRetirementTests, self).__init__()

class TestRetireUserByEmailMixin(TestCase):

    def setUp(self):
        super(TestRetireUserByEmailMixin, self).setUp()
        self.model = MockModelForRetirementTests()

    def test_retire_user_deletes_record_from_model(self):
        pass