from datetime import timedelta, date
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core import validators
from django.utils.translation import ugettext_lazy as _


class YearMonth(models.Model):
    user = models.ForeignKey(User)
    year = models.IntegerField(
        validators=[
            validators.MinValueValidator(1900),
            ],
    )
    month = models.IntegerField(
        validators=[
            validators.MinValueValidator(1),
            validators.MaxValueValidator(12)],
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True,)
    updated_at = models.DateTimeField(auto_now=True, null=True,)

    def __str__(self):
        return str(self.user)+":"+str(self.year)+"/"+str(self.month)

    class Meta:
        verbose_name = _('attendance')
        verbose_name_plural = _('attendances')


class Attendance(models.Model):
    """Attendance
    """

    yearmonth = models.ForeignKey(
        YearMonth,
        on_delete=models.CASCADE)
    date = models.DateField()
    stt_time = models.TimeField(default='00:00:00')
    end_time = models.TimeField(default='00:00:00')
    break_time = models.TimeField(default='00:00:00')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        unique_together = (('yearmonth', 'date'),)
        ordering = ['yearmonth', 'date']

    def __str__(self):
        return str(self.date)

    @property
    def str_operating_time(self):
        m, s = divmod(self.operating_time.seconds, 60)
        h, m = divmod(m, 60)
        return "%02d:%02d" % (h, m)

    @property
    def operating_time(self):
        s = timedelta(
            hours=self.stt_time.hour,
            minutes=self.stt_time.minute,
            seconds=self.end_time.second)
        e = timedelta(
            hours=self.end_time.hour,
            minutes=self.end_time.minute,
            seconds=self.end_time.second)
        t = timedelta(
            hours=self.break_time.hour,
            minutes=self.break_time.minute,
            seconds=self.end_time.second)

        if s > e:
            e += timedelta(days=1)

        return (e-s-t)

    @classmethod
    def get_query_set_Attendances(cls, yearmonth):
        return Attendance.objects.filter(yearmonth=yearmonth).order_by('date')

    def save_attendance(self, stt, end, break_time):
        self.stt_time = stt
        self.end_time = end
        self.break_time = break_time
        self.save()

    @receiver(post_save, sender=YearMonth)
    def create_attendances(sender, instance, created, **kwargs):
        if created:
            import calendar
            _, cnt = calendar.monthrange(instance.year, instance.month)
            for i in range(1, cnt+1):
                d = date(instance.year, instance.month, i)
                Attendance.objects.create(yearmonth=instance, date=d)
