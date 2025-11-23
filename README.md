# Application d’Analyse de Sentiment avec IA Externe, FastAPI et JWT

## Description

Cette application permet d’analyser le sentiment de textes via un service IA externe (Hugging Face) en utilisant le modèle `nlptown/bert-base-multilingual-uncased-sentiment`. L’API backend est sécurisée avec JWT et communique avec un frontend en React pour envoyer des textes et afficher les résultats en temps réel. L’API peut également être testée via **Postman**.

## Fonctionnalités

### Backend (FastAPI)

* Endpoint **POST /login** : authentifie l’utilisateur et retourne un token JWT.
* Endpoint **POST /predict** : reçoit un texte, envoie la requête à Hugging Face, et retourne le score de sentiment :

  * 1 ou 2 → négatif
  * 3 → neutre
  * 4 ou 5 → positif
* Sécurisé : `/predict` accessible uniquement avec un token JWT valide.
* Gestion des erreurs et des limites du service IA externe.

### Frontend (React)

* Page de **Login** : formulaire username/password, stockage du JWT dans localStorage.
* Page de **Sentiment** : formulaire pour envoyer un texte, affichage du sentiment et du score en temps réel.
* Gestion des états : loading / error / success.

### Dockerisation

* Conteneurs séparés pour le backend et le frontend.
* Facilement déployable et exécutable avec Docker.

## Test et utilisation

1. Démarrer le backend :

```bash
docker build -t backend .  
docker run -d -p 8000:8000 backend
```

2. Démarrer le frontend :

```bash
docker build -t frontend .  
docker run -d -p 3000:3000 frontend
```

3. Tester l’API via **Postman** ou le frontend :

* Pour Postman, envoyer un **POST** vers `http://localhost:8000/login` avec body JSON :

```json
{
  "username": "chaima",
  "password": "chaima"
}
```

* Copier le token JWT reçu et l’utiliser dans le header **Authorization: Bearer <token>** pour tester `/predict`.

4. Sur le frontend, login avec :

```
username: chaima
password: chaima
```

5. Envoyer un texte pour obtenir le score de sentiment.

## Remarques

* Le service IA externe peut être limité en nombre de requêtes ou en temps de réponse.
* JWT protège les endpoints sensibles pour éviter un accès non autorisé.

## Auteur

Chaimaa Zbairi – Développeur IA junior
