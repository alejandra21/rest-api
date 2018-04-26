# API RESTful haciendo uso de Node, Express y MongoDB 2.6.10

Esta API se construyó haciendo uso del tutorial que se encuentra en el siguiente link: [Link del tutorial](http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4).

Nota: El proyecto ha sido probado únicamente en Ubuntu 16.04.4 LTS

## Requerimientos

Al momento de probar el proyecto se utilizaron las siguientes versiones:

- Node 8.8.1
- npm 6.0.0
- MongoDB 2.6.10

## Pasos para correr el proyecto

- Se debe clonar el repositorio de git haciendo uso del siguiente comando:
```bash
git clone git@github.com:alejandra21/rest-api.git
```
- Instalar MongoDB 2.6.10 (en Ubuntu)
```bash
sudo apt-get install mongodb
```
- Nos movemos al directorio rest-api:
```bash
cd rest-api
```
- Luego se deben instalar las dependencias del proyecto
```bash
npm install
```
- Finalmente, se debe correr el servidor haciendo uso del comando presentado a continuación:
```bash
node server.js
```
## El API  responder bajo los siguientes endpoints

Para agregar un nuevo elemento en la base de datos:
- POST localhost:8080/exercises 

Para listr todos los elementos de la base de datos:
- GET localhost:8080/exercises 

Para listar un elemeto en especifico de la basa de datos:
- GET localhost:8080/exercises/:id 

Para modificar un elemento especifico de la base de datos:
- PUT localhost:8080/exercises

Para eliminar un elemento especifico de la base de datos:
- DELETE localhost:8080/exercises/:id

## Estructura de datos

```json
{
    "name": "Prueba",
    "typeExercise": "exercise",
    "mainImage": "urlimagen.jpg",
    "levelDifficulty": 1,
    "creationDate": "2017-11-07",
    "timer": {
            "duration": 180
    },
            "lights": [
            {
                "colorCode": "300, 30, 1"
            }
        ],
        "music": [
            {
                "name": "name example",
	"sourcePath": "home/asd/asd.mp3",
	"volumen": 1
	}
	        ],
	        "videoTutor": [
	            {
	                "name": "",
	                "sourcePath": "home/asd/asd.mp4"
	}
	        ]
}	

```

## Especificaciones para realizar PUT en el API

Es necesario incluir el id en el JSON que se le enviará al backend. Un ejemplo de esto se mostrará a continuación:

```json
 
	{
	    "id": "5",
	    "name": "Prueba5",
	    "typeExercise": "test",
	    "mainImage": "ping.jpg",
	    "levelDifficulty": 10,
	    "creationDate": "2018-03-01",
	    "status": "disabled"
	}

```
