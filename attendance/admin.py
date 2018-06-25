from django.contrib import admin
from .models import Attendance, YearMonth



# class AttendanceAdmin(admin.ModelAdmin):
#     list_display = ('user_id', 'date', 'stt_time','end_time','break_time')
#     list_filter = ['date']

# admin.site.register(Attendance, AttendanceAdmin)


# class AttendanceAdmin(admin.ModelAdmin):
#     list_display = ('month', 'date', 'stt_time','end_time','break_time')
#     list_filter = ['date']

class AttendanceInline(admin.TabularInline):
    model = Attendance
    extra=1

class YearMonthAdmin(admin.ModelAdmin):
    inlines = [AttendanceInline]

admin.site.register(YearMonth, YearMonthAdmin)