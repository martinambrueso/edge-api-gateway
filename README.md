# edge-api-gateway

# Diagrama general

![general.png.jpg](/img/general.png)

# Edge API Gateway

![edge_api_gw.png.jpg](/img/edge_api_gw.png)

# Inicializacion

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

# Uso

```bash
curl -X [GET/POST/PUT/DELTE ...] \
    http://localhost:3000/<service>/path/to/endpoint?some=param&foo=baar \
    -H "Content-Type: application/json" \
    -H "X-SOME-HEADER: some-value" \
    ...
    ..
    .
    --data '{ \
        "some":"data" \
    }'
```

Ejemplo real:
```bash
curl -X GET http://localhost:3000/github/user/repos -H "Content-Type: application/json"
```

Response:
```json
[
  {
    "id": 336916526,
    "node_id": "MDEwOlJlcG9zaXRvcnkzMzY5MTY1MjY=",
    "name": "CloudSecurityMELIChallenge",
    "full_name": "martinambrueso/CloudSecurityMELIChallenge",
    "private": false,
    "owner": {
      "login": "martinambrueso",
      ...
      ..
      .
```