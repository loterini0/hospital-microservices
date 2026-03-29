from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Appointment
        fields = '__all__'

    def validate(self, data):
        if data.get('patient_id') == data.get('doctor_id'):
            raise serializers.ValidationError('Patient and doctor cannot be the same')
        return data