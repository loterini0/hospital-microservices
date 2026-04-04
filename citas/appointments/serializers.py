from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Appointment
        fields = '__all__'

    def validate(self, data):

        if data.get('patient_id') == data.get('doctor_id'):
            raise serializers.ValidationError('Patient and doctor cannot be the same')


        doctor_id  = data.get('doctor_id')
        date       = data.get('date')
        time       = data.get('time')
        instance   = self.instance

        conflict = Appointment.objects.filter(
            doctor_id=doctor_id,
            date=date,
            time=time,
            status='scheduled'
        )

        if instance:
            conflict = conflict.exclude(pk=instance.pk)

        if conflict.exists():
            raise serializers.ValidationError(
                f'Doctor {doctor_id} already has an appointment on {date} at {time}'
            )


        patient_id = data.get('patient_id')

        conflict_patient = Appointment.objects.filter(
            patient_id=patient_id,
            date=date,
            time=time,
            status='scheduled'
        )

        if instance:
            conflict_patient = conflict_patient.exclude(pk=instance.pk)

        if conflict_patient.exists():
            raise serializers.ValidationError(
                f'Patient {patient_id} already has an appointment on {date} at {time}'
            )

        return data