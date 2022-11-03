# edge-api-gateway

Montar imagenes:
```bash
docker-compose up --build
```

Instalar dependencias:
```bash
npm install
```

Inicializar ambiente:
```bash
# inicializa db
node .\utils\initdb.js
# inicializa boveda
node .\utils\init-vault.js
# desbloquea boveda
node .\utils\unseal.js
# crea secret de prueba
node .\utils\create-secret.js
```

Correr app:
```bash
npm start
```

# Diagrama general

![general.png.jpg](/img/general.png)

# Edge API Gateway

![edge_api_gw.png.jpg](/img/edge_api_gw.png)
