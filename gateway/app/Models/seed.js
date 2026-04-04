const BASE = 'http://localhost:8000/api';

const nombres = ['Carlos','María','Juan','Ana','Luis','Sofia','Pedro','Laura','Miguel','Valentina',
  'Andrés','Isabella','Jorge','Camila','Diego','Daniela','Sebastián','Mariana','Felipe','Natalia'];
const apellidos = ['García','Rodríguez','López','Martínez','González','Pérez','Sánchez','Ramírez','Torres','Flores'];
const especialidades = ['Cardiología','Neurología','Pediatría','Ortopedia','Dermatología','Ginecología','Oncología','Psiquiatría','Radiología','Medicina General'];
const motivos = ['Consulta de control','Dolor de cabeza persistente','Chequeo anual','Revisión post-operatoria','Dolor abdominal','Dificultad para respirar','Fiebre alta','Control de presión arterial','Revisión de medicamentos','Consulta de seguimiento'];
const diagnosticos = ['Hipertensión arterial','Diabetes tipo 2','Migraña crónica','Lumbalgia','Gastritis','Bronquitis aguda','Anemia','Artritis reumatoide','Depresión moderada','Hipotiroidismo'];
const prescripciones = ['Losartán 50mg cada 24h','Metformina 850mg cada 12h','Ibuprofeno 400mg cada 8h','Omeprazol 20mg en ayunas','Amoxicilina 500mg cada 8h','Atorvastatina 40mg cada noche','Levotiroxina 50mcg en ayunas','Sertralina 50mg cada 24h','Naproxeno 500mg cada 12h','Vitamina D3 1000UI cada 24h'];
const mensajes = ['Tiene una cita programada para mañana','Recuerde tomar sus medicamentos','Su historial ha sido actualizado','Cita confirmada exitosamente','Resultado de examen disponible','Recordatorio de cita médica','Su médico ha dejado un mensaje','Próxima cita en 7 días','Medicamento listo para recoger','Control médico pendiente'];

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getToken(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  return data.access_token;
}

async function post(endpoint, body, token) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function main() {
  console.log('🔐 Autenticando como admin...');
  const adminToken = await getToken('admin@hospital.com', 'password123');
  if (!adminToken) { console.error('❌ No se pudo obtener token de admin'); return; }
  console.log('✅ Token obtenido\n');

  // 1. Crear 10 doctores
  console.log('👨‍⚕️ Creando 10 doctores...');
  const doctores = [];
  for (let i = 0; i < 10; i++) {
    const nombre = `${rand(nombres)} ${rand(apellidos)}`;
    const esp = especialidades[i];
    const email = `doctor${i+1}@hospital.com`;
    const user = await post('/users', {
      name: `Dr. ${nombre}`,
      email,
      password: 'password123',
      phone: `31${randInt(10,99)}${randInt(1000000,9999999)}`,
      role: 'doctor'
    }, adminToken);
    doctores.push(user);
    console.log(`  ✅ Dr. ${nombre} (${esp}) - ${email}`);
    await sleep(200);
  }

  // 2. Crear 10 pacientes
  console.log('\n🧑 Creando 10 pacientes...');
  const pacientes = [];
  for (let i = 0; i < 10; i++) {
    const nombre = `${rand(nombres)} ${rand(apellidos)}`;
    const email = `paciente${i+1}@hospital.com`;
    const user = await post('/users', {
      name: nombre,
      email,
      password: 'password123',
      phone: `31${randInt(10,99)}${randInt(1000000,9999999)}`,
      role: 'patient'
    }, adminToken);
    pacientes.push(user);
    console.log(`  ✅ ${nombre} - ${email}`);
    await sleep(200);
  }

  // Obtener IDs reales desde /users
  console.log('\n📋 Obteniendo IDs de usuarios...');
  const usersRes = await fetch(`${BASE}/users`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const allUsers = await usersRes.json();
  const doctorUsers  = allUsers.filter(u => u.role === 'doctor').slice(0, 10);
  const patientUsers = allUsers.filter(u => u.role === 'patient').slice(0, 10);
  console.log(`  📌 ${doctorUsers.length} doctores, ${patientUsers.length} pacientes encontrados`);

  // 3. Crear 50 citas - necesitamos token de paciente
  console.log('\n📅 Creando 50 citas médicas...');
  const pacienteToken = await getToken('paciente@hospital.com', 'password123');
  const statuses = ['scheduled','scheduled','scheduled','completed','completed'];
  const citas = [];
  for (let i = 0; i < 50; i++) {
    const paciente = patientUsers[i % patientUsers.length];
    const doctor   = doctorUsers[i % doctorUsers.length];
    const daysOffset = randInt(-30, 30);
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dateStr = date.toISOString().split('T')[0];
    const hour = randInt(7, 17);
    const min  = ['00','15','30','45'][randInt(0,3)];
    const status = rand(statuses);

    const cita = await post('/appointments', {
      patient_id: paciente?.id,
      doctor_id:  doctor?.id,
      date:       dateStr,
      time:       `${hour}:${min}:00`,
      reason:     rand(motivos),
      status
    }, adminToken);
    citas.push(cita);
    if ((i+1) % 10 === 0) console.log(`  ✅ ${i+1}/50 citas creadas`);
    await sleep(150);
  }

  // 4. Crear 50 historiales - necesitamos token de doctor
  console.log('\n📋 Creando 50 historiales clínicos...');
  const doctorToken = await getToken('doctor@hospital.com', 'password123');
  for (let i = 0; i < 50; i++) {
    const paciente = patientUsers[i % patientUsers.length];
    const doctor   = doctorUsers[i % doctorUsers.length];
    await post('/records', {
      patient_id:   paciente?.id,
      doctor_id:    doctor?.id,
      diagnosis:    rand(diagnosticos),
      prescription: rand(prescripciones),
      notes:        `Paciente en seguimiento. Control en ${randInt(15,60)} días.`
    }, doctorToken);
    if ((i+1) % 10 === 0) console.log(`  ✅ ${i+1}/50 historiales creados`);
    await sleep(150);
  }

  // 5. Crear 50 notificaciones
  console.log('\n🔔 Creando 50 notificaciones...');
  const tipos = ['appointment','reminder','alert'];
  for (let i = 0; i < 50; i++) {
    const usuario = [...patientUsers, ...doctorUsers][i % 20];
    await post('/notifications', {
      user_id: usuario?.id,
      type:    rand(tipos),
      message: rand(mensajes)
    }, adminToken);
    if ((i+1) % 10 === 0) console.log(`  ✅ ${i+1}/50 notificaciones creadas`);
    await sleep(150);
  }

  console.log('\n🎉 ¡Datos creados exitosamente!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Resumen:');
  console.log('  👨‍⚕️ 10 doctores creados');
  console.log('  🧑  10 pacientes creados');
  console.log('  📅  50 citas médicas');
  console.log('  📋  50 historiales clínicos');
  console.log('  🔔  50 notificaciones');
  console.log('\n🔑 Credenciales de acceso:');
  console.log('  Admin:    admin@hospital.com / password123');
  console.log('  Doctor:   doctor1@hospital.com / password123');
  console.log('  Paciente: paciente1@hospital.com / password123');
}

main().catch(console.error);
