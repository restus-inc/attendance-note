from django.shortcuts import get_object_or_404, render, redirect
from .models import Attendance, YearMonth, Project, AttendanceProcess
from datetime import datetime
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.db import transaction


def update(request, yearmonth_id):
    if request.method == "POST" and request.POST.get("yearNumber") is not None:
        return index(request)

    yearmonth = get_object_or_404(YearMonth, pk=yearmonth_id)
    attendances = Attendance.get_query_set_Attendances(yearmonth=yearmonth_id)

    _sec = 0
    _message = ""

    try:
        with transaction.atomic():
            for at in attendances:
                if request.method == "POST":
                    at.save_attendance(
                        stt=(datetime.strptime(
                            request.POST[f'stt_time{ at.id }'],
                            '%H:%M')).time(),
                        end=(datetime.strptime(
                            request.POST[f'end_time{ at.id }'],
                            '%H:%M')).time(),
                        break_time=(datetime.strptime(
                            request.POST[f'break_time{ at.id }'],
                            '%H:%M')).time()
                    )
                    pjIds = request.POST.getlist(f'proj_id_{ at.id }', '')
                    pjCodes = request.POST.getlist(f'proj_code_{ at.id }', '')
                    pjHours = request.POST.getlist(f'proj_hour_{ at.id }', 0)
                    i = 0
                    for pjId in pjIds:
                        AttendanceProcess.insertUpdate(
                            attendance=at,
                            id=pjId,
                            number=(i+1),
                            pj=pjCodes[i],
                            hour=pjHours[i]
                        )
                        i += 1
                _sec += at.operating_time.seconds
    except ValueError:
        _message = _("Time format is invalid.")
    else:
        if request.method == "POST":
            _message = _("Saved.")
            pass

    m, s = divmod(_sec, 60)
    h, m = divmod(m, 60)
    total_time = "%02d:%02d" % (h, m)

    users = User.objects.all()
    projects = Project.get_query_set()
    dtils = AttendanceProcess.get_query_set(yearmonth=yearmonth_id)

    return render(request, 'attendance/update.html', {
        'items': attendances,
        'total_time': total_time,
        'yearmonth_id': yearmonth_id,
        'wk_message': _message,
        'users': users,
        't_user': yearmonth.user.id,
        't_year': yearmonth.year,
        't_month': yearmonth.month,
        'projects': projects,
        'dtils': dtils})


@transaction.atomic
def index(request):
    if request.method == "POST":

        _u = request.POST[f'userDrop']
        _y = int(request.POST[f'yearNumber'])
        _m = int(request.POST[f'monthNumber'])

        if YearMonth.objects.filter(user=_u, year=_y, month=_m).exists():
            _key = 0
            for ym in YearMonth.objects.filter(user=_u, year=_y, month=_m):
                _key = ym.id
                break

            return redirect('attendance:update', yearmonth_id=_key)

        else:
            _u = User.objects.get(pk=_u)
            ym = YearMonth.objects.create(user=_u, year=_y, month=_m)

            return redirect('attendance:update', yearmonth_id=ym.id)
    else:
        users = User.objects.all()
        _u = request.user.id
        _y = datetime.now().year
        _m = datetime.now().month

        return render(request, 'attendance/index.html', {
            'users': users,
            't_user': _u,
            't_year': _y,
            't_month': _m})
