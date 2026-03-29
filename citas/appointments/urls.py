from django.urls import path
from . import views

urlpatterns = [
    path('',                          views.get_appointments,            name='appointments'),
    path('create/',                   views.create_appointment,          name='create-appointment'),
    path('patient/<int:patient_id>/', views.get_appointments_by_patient, name='appointments-by-patient'),
    path('<int:pk>/',                 views.get_appointment,             name='appointment'),
    path('<int:pk>/update/',          views.update_appointment,          name='update-appointment'),
    path('<int:pk>/delete/',          views.delete_appointment,          name='delete-appointment'),
]