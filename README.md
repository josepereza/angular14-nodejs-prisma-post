# nodejs-blog-typescript-prisma-crud
## Instrucciones
  ### Para desarrollo ejecutamos
          
         ```
         C:\Users\josep\node\my-blog>npx ts-node src/index.ts
         ```
         
   ### Para produccion ejecutamos
          
         ```
      # C:\Users\josep\node\my-blog\src>npx tsc
      # C:\Users\josep\node\my-blog\dist>node index.js
         ```      
Einrichten von Prisma mit PostgreSQL
In diesem Schritt installieren Sie die Prisma-CLI , erstellen Ihre erste Prisma-Schemadatei, richten PostgreSQL mit Docker ein und verbinden Prisma damit. Das Prisma-Schema ist die wichtigste Konfigurationsdatei für Ihr Prisma-Setup und enthält das Datenbankschema.

Installieren Sie zunächst die Prisma-CLI mit dem folgenden Befehl:

npm install @prisma/cli --save-dev
Als bewährte Praxis wird empfohlen, die Prisma-CLI in Ihrem Projekt lokal zu installieren (und nicht im Rahmen einer globalen Installation). Dadurch lassen sich Versionskonflikte vermeiden, falls Sie mehr als ein Prisma-Projekt auf Ihrem Rechner verwenden.

Als Nächstes richten Sie mit Docker Ihre PostgreSQL-Datenbank ein. Erstellen Sie mit dem folgenden Befehl eine neue Docker Compose-Datei:

nano docker-compose.yml
Fügen Sie der neu erstellten Datei den folgenden Code hinzu:

my-blog/docker-compose.yml
```
version: '3.8'
services:
  postgres:
    image: postgres:10.3
    restart: always
    environment:
      - POSTGRES_USER=sammy
      - POSTGRES_PASSWORD=your_password
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'
volumes:
  postgres:
  ```
Diese Docker Compose-Datei konfiguriert eine PostgreSQL-Datenbank, auf die über Port 5432 des Docker-Containers zugegriffen werden kann. Beachten Sie außerdem, dass die Anmeldedaten für die Datenbank aktuell sammy (Benutzer) und your_password (Passwort) lauten. Sie können diese Anmeldedaten in Ihren bevorzugten Benutzer und Ihr bevorzugtes Passwort ändern. Speichern und schließen Sie die Datei.

Fahren Sie nun fort und starten Sie den PostgreSQL-Datenbankserver mit dem folgenden Befehl:
```
docker-compose up -d
```
Die Ausgabe dieses Befehls wird in etwa wie folgt aussehen:
```
Output
Pulling postgres (postgres:10.3)...
10.3: Pulling from library/postgres
f2aa67a397c4: Pull complete
6de83ca23e55: Pull complete
. . .
Status: Downloaded newer image for postgres:10.3
Creating my-blog_postgres_1 ... done
```
Sie können mit folgendem Befehl überprüfen, ob der Datenbankserver ausgeführt wird:
```
docker ps
```
Dadurch erhalten Sie eine Aufgabe, die in etwa wie folgt aussieht:
```
Output
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
8547f8e007ba        postgres:10.3       "docker-entrypoint.s…"   3 seconds ago       Up 2 seconds        0.0.0.0:5432->5432/tcp   my-blog_postgres_1
```
Nachdem der Datenbankserver ausgeführt wird, können Sie nun Ihr Prisma-Setup erstellen. Führen Sie den folgenden Befehl über die Prisma-CLI aus:
```
npx prisma init
```
Dadurch erhalten Sie folgende Ausgabe:
```
Output
✔ Your Prisma schema was created at prisma/schema.prisma.
  You can now open it in your favorite editor.
  ```
Beachten Sie, dass Sie als bewährte Praxis allen Aufrufen der Prisma-CLI npx voranstellen sollten. Dadurch wird sichergestellt, dass Sie Ihre lokale Installation verwenden.

Nachdem Sie den Befehl ausgeführt haben, erstellt die Prisma-CLI in Ihrem Projekt einen neuen Ordner namens prisma. Er enthält die folgenden zwei Dateien:

schema.prisma: Die Hauptkonfigurationsdatei für Ihr Prisma-Projekt (schließt Ihr Datenmodell mit ein).
.env: Eine dotenv-Datei zum Definieren Ihrer Datenbankverbindungs-URL.
Um sicherzustellen, dass Prisma den Speicherort Ihrer Datenbank kennt, öffnen Sie die Datei .env und passen Sie die Umgebungsvariable DATABASE_URL an.

Öffnen Sie zunächst die .env-Datei:
```
nano prisma/.env
```
Jetzt können Sie die Umgebungsvariable wie folgt setzen:

my-blog/prisma/.env
```
DATABASE_URL="postgresql://sammy:your_password@localhost:5432/my-blog?schema=public"
```
Ändern Sie die Anmeldedaten für die Datenbank unbedingt auf jene, die Sie in der Docker Compose-Datei angegeben haben. Um mehr über das Format der Verbindungs-URL zu erfahren, besuchen Sie die Prisma-Dokumentation.

Wenn Sie damit fertig sind, speichern und schließen Sie die Datei.

In diesem Schritt haben Sie Ihre PostgreSQL-Datenbank mit Docker eingerichtet, die Prisma-CLI installiert und Prisma über eine Umgebungsvariable mit der Datenbank verbunden. Im nächsten Abschnitt definieren Sie Ihr Datenmodell und erstellen Ihre Datenbanktabellen.

Schritt 3 — Definieren des Datenmodells und Erstellen von Datenbanktabellen

## postgres -comandos
```
\l - Display database
\c - Connect to database
\dn - List schemas
\dt - List tables inside public schemas
\dt schema1.* - List tables inside particular schemas. For eg: 'schema1'.
\c my-blog
# select * from "Post";
```
