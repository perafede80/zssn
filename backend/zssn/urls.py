from django.contrib import admin
from zssn_app.views import health_check, SurvivorViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter

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
