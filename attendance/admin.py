from django.contrib import admin
from .models import Attendance, YearMonth, Project


class AttendanceInline(admin.TabularInline):
    model = Attendance
    extra = 1


class YearMonthAdmin(admin.ModelAdmin):
    inlines = [AttendanceInline]
    list_display = ('user', 'year', 'month')


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'is_valid')


admin.site.register(YearMonth, YearMonthAdmin)
admin.site.register(Project, ProjectAdmin)
