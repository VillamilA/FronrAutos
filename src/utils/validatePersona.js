// Validaciones reutilizables para formularios de cliente y técnico
export function validatePersonaFields({ nombre, apellido, cedula, telefono, fecha_nacimiento, email, password, confirmPassword, isRegister = false }) {
  // Nombres y apellidos solo letras y espacios
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!soloLetras.test(nombre)) return "El nombre solo puede contener letras y espacios";
  if (!soloLetras.test(apellido)) return "El apellido solo puede contener letras y espacios";

  // Cédula: 10 dígitos
  if (!/^\d{10}$/.test(cedula)) return "La cédula debe tener exactamente 10 dígitos";

  // Teléfono: 10 dígitos y empieza por 09
  if (!/^09\d{8}$/.test(telefono)) return "El teléfono debe tener 10 dígitos y empezar por 09";

  // Fecha de nacimiento: año realista (10-100 años)
  if (fecha_nacimiento) {
    const year = new Date(fecha_nacimiento).getFullYear();
    const now = new Date();
    const edad = now.getFullYear() - year;
    if (edad < 10 || edad > 100) return "La fecha de nacimiento no es válida (debe tener entre 10 y 100 años)";
  }

  // Email válido
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return "El email no es válido";

  // Contraseña (solo en registro)
  if (isRegister) {
    if (!password || password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (confirmPassword !== undefined && password !== confirmPassword) return "Las contraseñas no coinciden";
  }

  return null;
}
