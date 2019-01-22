from django.test import TestCase, Client
from django.contrib.auth.models import User
from attendance.models import Attendance


class IndexTests(TestCase):
    def setUp(self):
        User.objects.create_user(
            username='test', email='test@example.com', password='pass')

    def test_view_status_code(self):
        c = Client()
        url = '/'
        response = c.get(url)
        self.assertEquals(response.status_code, 200)

        response = c.post(url, {'userDrop': 1,
                                'yearNumber': 2019,
                                'monthNumber': 1})
        self.assertEquals(response.status_code, 302)
        all = Attendance.objects.all()
        self.assertEquals(len(all), 31)

        url = '/1/'
        response = c.get(url)
        self.assertEquals(response.status_code, 200)
