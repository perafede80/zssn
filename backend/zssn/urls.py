from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from zssn_app.views import SurvivorViewSet, health_check

# Create a router and register the SurvivorViewSet
router = DefaultRouter()
router.register(r'survivors', SurvivorViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("health/", health_check),
]

# Add the router's URLs
urlpatterns += [
    path('api/', include(router.urls)),
]
