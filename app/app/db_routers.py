class UserTablesRouter:
    """
    A router to control database operations for models related to user-defined tables.
    """
    def db_for_read(self, model, **hints):
        """
        Directs read operations for models to the 'user_tables' database.
        """
        if model._meta.app_label == 'user_tables':
            return 'user_tables'
        return None

    def db_for_write(self, model, **hints):
        """
        Directs write operations for models to the 'user_tables' database.
        """
        if model._meta.app_label == 'user_tables':
            return 'user_tables'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if both objects are in the 'user_tables' app.
        """
        if (
            obj1._meta.app_label == 'user_tables' or
            obj2._meta.app_label == 'user_tables'
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Ensure that only models in the 'user_tables' app are migrated to the 'user_tables' database.
        """
        if app_label == 'user_tables':
            return db == 'user_tables'
        return None
