# 🚀 Guía para Subir a GitHub

Esta guía te ayudará a subir el proyecto PolkaEdu a GitHub en la rama `main`.

## 📋 Pasos para Subir a GitHub

### 1. Crear el Repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
3. Copia la URL del repositorio (ej: `https://github.com/tu-usuario/PolkaEdu.git`)

### 2. Configurar Git Localmente

```bash
# Verificar que estás en la raíz del proyecto
cd C:\Users\Samis\Desktop\polkaedu\PolkaEdu

# Verificar el estado actual
git status

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: PolkaEdu monorepo with backend and frontend"

# Agregar el remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/PolkaEdu.git

# Cambiar a la rama main (si no estás ya en ella)
git branch -M main

# Subir a GitHub
git push -u origin main
```

### 3. Verificar que Todo se Subió Correctamente

1. Ve a tu repositorio en GitHub
2. Verifica que veas las carpetas `backend/` y `frontend/`
3. Verifica que el README.md principal se muestre correctamente

## 📁 Estructura que se Subirá

```
PolkaEdu/
├── .gitignore          # Archivos a ignorar
├── .gitattributes      # Configuración de Git
├── README.md           # Documentación principal
├── package.json        # Configuración del monorepo
├── GITHUB_SETUP.md     # Esta guía
├── backend/            # Código del backend
│   ├── src/
│   ├── scripts/
│   ├── package.json
│   └── README.md
└── frontend/           # Código del frontend
    ├── src/
    ├── public/
    ├── package.json
    └── README.md
```

## ⚠️ Archivos que NO se Subirán

Gracias al `.gitignore`, estos archivos NO se subirán:
- `node_modules/` (dependencias)
- `.env` (variables de entorno sensibles)
- `dist/` y `build/` (archivos compilados)
- Archivos temporales y de IDE

## 🔄 Actualizaciones Futuras

Para subir cambios futuros:

```bash
# Ver qué cambió
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

## 📝 Notas Importantes

1. **Variables de Entorno**: Nunca subas archivos `.env` con información sensible
2. **Dependencias**: Cada proyecto (backend y frontend) tiene su propio `package.json`
3. **Rama Principal**: Usa `main` como rama principal
4. **Commits**: Haz commits descriptivos y frecuentes

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```bash
# Eliminar el remoto existente
git remote remove origin

# Agregar el nuevo remoto
git remote add origin https://github.com/tu-usuario/PolkaEdu.git
```

### Error: "failed to push some refs"
```bash
# Si hay cambios en GitHub que no tienes localmente
git pull origin main --rebase

# Luego intenta push de nuevo
git push -u origin main
```

### Verificar el Remoto
```bash
# Ver el remoto configurado
git remote -v
```

---

¡Listo! Tu proyecto está organizado como monorepo y listo para GitHub. 🎉

