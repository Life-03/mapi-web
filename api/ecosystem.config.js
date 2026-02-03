export default {
    apps: [
      {
        name: 'api',  // Nombre de tu aplicación en PM2
        script: './index.js',  // Archivo principal
        exec_mode: 'fork',  // Usa 'cluster' si quieres balanceo de carga
        autorestart: true,  // Reiniciar automáticamente si falla
        watch: false,  // Cambia a true si quieres reinicio en cambios de código
      }
    ]
  };
  