
from django.conf.urls import url, include
from django.contrib import admin
from . import settings

urlpatterns = [
    url(r'^', include('attendance.urls')),
    url(r'^admin/', admin.site.urls),
]

if settings.DEBUG:
    try:
        import debug_toolbar
        urlpatterns += [
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ]
    except ImportError:
        pass
