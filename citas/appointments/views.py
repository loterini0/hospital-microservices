from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
import requests
import os

def send_notification(patient_id, message):
    try:
        requests.post(
            "http://localhost:3002/api/notifications/",
            json={
                "user_id": patient_id,
                "type": "appointment",
                "message": message
            },
            headers={"X-Gateway-Secret": os.getenv("GATEWAY_SECRET")},
            timeout=3
        )
    except Exception:
        pass

@api_view(["GET"])
def get_appointments(request):
    appointments = Appointment.objects.all()
    serializer   = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)

@api_view(["GET"])
def get_appointments_by_patient(request, patient_id):
    appointments = Appointment.objects.filter(patient_id=patient_id)
    serializer   = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        appointment = serializer.save()
        send_notification(
            appointment.patient_id,
            f"Su cita medica ha sido programada para el {appointment.date} a las {appointment.time}"
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def update_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = AppointmentSerializer(appointment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
def delete_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
    appointment.delete()
    return Response({"message": "Appointment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
