"""
Custom Django Model mixins.
"""


class DeprecatedModelMixin(object):
    """
    Used to make a class unusable in practice, but leave database tables intact.
    """
    def __init__(self, *args, **kwargs):  # pylint: disable=unused-argument
        """
        Override to kill usage of this model.
        """
        raise TypeError("This model has been deprecated and should not be used.")


class DeletableByUserEmail(object):
    """
    This mixin allows inheriting models to delete users by their email field.
    """

    @classmethod
    def retire_user(cls, user_email):
        """
        Deletes user_email's record in the cls model.

        Returns True if user_email's records were deleted.
        Returns False otherwise.
        """
        assert hasattr(cls, 'email'), 'Inheriting model must have an "email" field.'

        user_search_results = cls.objects.filter(
            email=user_email
        )
        num_deleted_records, _ = user_search_results.delete()
        return num_deleted_records > 0
