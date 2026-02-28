from rest_framework import permissions

class IsOrganizer(permissions.BasePermission):
    """
    Custom permission to only allow organizers to create/edit/delete events.
    """
    def has_permission(self, request, view):
        # Allow read-only permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to organizers
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'organizer')
        
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the organizer of the event
        # obj is a dict since we are using PyMongo
        return obj.get('organizer') == request.user.id

class IsParticipant(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'participant')
