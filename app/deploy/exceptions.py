from django.db import IntegrityError

class ApiHashConflict(IntegrityError):
    pass

class GenericDBException(IntegrityError):
    pass

class TableCreationFailedException(Exception):
    pass

class TableInvalidSerializerException(Exception):
    pass

class InvalidValueException(Exception):
    pass