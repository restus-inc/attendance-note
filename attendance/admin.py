from django.contrib import admin
from .models import Attendance, YearMonth


class AttendanceInline(admin.TabularInline):
    model = Attendance
    extra = 1


class YearMonthAdmin(admin.ModelAdmin):
    inlines = [AttendanceInline]


admin.site.register(YearMonth, YearMonthAdmin)
