# Construire une API sécurisée pour une application d'avis gastronomiques
## Introduction
Le frontend est fourni et téléchargeable sur : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6. vous trouverez le README inclus. Il contient la description des étapes du lancement du frontend.

## Prérequis

Avant de démarrer, vous devez avoir installé sur votre ordinateur :
- Node.js
- npm (gestionnaire de packages Node)

## Installation

Pour installer les dépendances nécessaires, accédez à la racine du projet et exécutez la commande suivante dans votre terminal :

npm install

## Exécution de l'API
Avant de démarrer l'API, renommer le fichier .env.sample par .env, dans ce fichier mettez votre adresse de base de donnée mongodb (MONGO_URL) et un mot de passe (JWT_PASSWORD). Ensuite, vous pouvez accédez à la racine du projet et exécutez la commande suivante dans votre terminal :

npm install nodemon

Ensuite lancer le serveur avec 
 
 nodemon server (ou nodemon.cmd)

## Création d'un compte utilisateur
Pour pouvoir s'inscrire comme utilisateur, il vous faudra un format addresse mail valide exp: toto@gmail.com. le mot de passe doit être compposé de : 
- 8 caractères minimum
- au moins une majuscule
- au moins un miniscule
- un caractère (. , ? ! ...)
- ne contient pas d'espace

