Descriere Generala

Aplicatia va fi o Single Page Application (SPA) ce permite gestionarea bug-urilor dintr-o echipa de dezvoltare software. Utilizatorii aplicatiei se impart in doua categorii:

    Membri de Proiect (MP): Pot inregistra proiecte, vizualiza bug-urile si aloca rezolvarea acestora.
    Testeri (TST): Pot raporta bug-uri asociate proiectelor inregistrate.

Aplicatia va fi accesibila din browser pe dispozitive desktop, mobile si tablete.
Tehnologii Utilizate

    Frontend: React
    Backend: Node.js
    Baza de date: SQLite
    Autentificare: Sistem bazat pe email si parola, folosind biblioteci precum bcrypt pentru securizarea parolelor

Functionalitati
Autentificare si Autorizare

    Utilizatorii se pot conecta folosind o adresa de email si o parola.
    Sistemul distinge intre utilizatorii MP si TST prin roluri.
    MP au permisiuni de administrare a proiectelor si bug-urilor.
    TST pot adauga bug-uri.

Gestionarea Proiectelor

    MP pot crea un proiect specificand:
        Numele proiectului
        Repository-ul proiectului
        Echipa (lista de email-uri).
    Proiectele sunt vizibile doar membrilor echipei.

Adaugarea si Vizualizarea Bug-urilor

    TST pot inregistra bug-uri, specificand:
        Severitatea (ex.: Critic, Mediu, Minor)
        Prioritatea (ex.: Inalta, Medie, Scazuta)
        O descriere detaliata
        Un link la commit-ul asociat.
    MP pot vedea toate bug-urile proiectului si detaliile acestora.

Alocarea si Rezolvarea Bug-urilor

    MP pot selecta un bug si sa il aloce pentru rezolvare.
    Dupa rezolvare, MP pot adauga un link la commit-ul de rezolvare si schimba statusul bug-ului (ex.: „Rezolvat”).

Sistem de Permisiuni

    MP pot adauga/edita proiecte si actualiza statusul bug-urilor.
    TST pot doar adauga bug-uri.

Structura Aplicatiei
Frontend

    Homepage: Formulare de autentificare si inregistrare.
    Dashboard:
        Vizualizare proiecte.
        Adaugare bug-uri (vizibil doar pentru TST).
        Gestionare bug-uri (vizibil doar pentru MP).

Backend

    Endpoint-uri REST API:
        /auth/login - pentru autentificare.
        /projects - pentru gestionarea proiectelor.
        /bugs - pentru gestionarea bug-urilor.
    Validari:
        Asigurarea ca doar utilizatorii autorizati pot accesa datele proiectelor si bug-urilor.

Baza de Date

    Tabele:
        users: stocheaza utilizatorii (email, parola, rol).
        projects: detalii despre proiecte.
        bugs: detalii despre bug-uri (severitate, prioritate, descriere, status, link commit).
        project_members: relatia intre utilizatori si proiecte.
