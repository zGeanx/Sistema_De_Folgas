from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permissão customizada: apenas o dono do objeto ou admin pode acessar/modificar
    """
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        
        return obj.usuario == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permissão customizada: apenas admin pode modificar, outros podem ler
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        return request.user.is_staff
