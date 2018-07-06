from django.conf.urls import url
from django.views.i18n import JavaScriptCatalog
from . import views

app_name = 'attendance'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^jsi18n/$', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    url(r'^(?P<yearmonth_id>[0-9]+)/$', views.update, name='update'),
]
