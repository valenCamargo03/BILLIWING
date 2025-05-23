import app from "./app.js";
import { sequelize } from "./database/database.js";
import User from "./models/User.js";

const main = async () => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');
    
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, '0.0.0.0');
    console.log(`🚀 Servidor BILLIWING corriendo en puerto ${PORT}`);
    console.log(`📋 API disponible en: http://localhost:${PORT}`);
    console.log(`🔐 Autenticación: http://localhost:${PORT}/api/auth/status`);
    
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    process.exit(1);
  }
};

main();
