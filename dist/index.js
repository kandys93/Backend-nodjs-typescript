"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    constructor(id) {
        this.id = id;
    }
}
class Person extends Entity {
    constructor(id, firstname, lastname) {
        super(id);
        this.firstname = firstname;
        this.lastname = lastname;
    }
}
class Company extends Entity {
    constructor(id, name) {
        super(id);
        this.name = name;
    }
}
class BaseProvider {
    list() {
        //faire preuve d'abstraction
        return this.getData();
    }
    search(text) {
        //retourne une liste :d'objet
        let search = text.toLowerCase();
        let results = [];
        for (const item of this.getData()) {
            //boucle qui recupere les données : format JSON
            if (JSON.stringify(item).toLowerCase().includes(search)) {
                results.push(item);
            }
        }
        return results;
    }
}
class PersonProvider extends BaseProvider {
    getData() {
        //retourner une liste d'objet Person, text:string
        let p1 = new Person(1, "Sophie", "Lozophy");
        let p2 = new Person(2, "Annie", "Versaire");
        let p3 = new Person(3, "Paul", "Ochon");
        return [p1, p2, p3];
    }
}
class CompanyProvider extends BaseProvider {
    getData() {
        //retourner une liste d'objet Company
        let c1 = new Company(1, "Google");
        let c2 = new Company(2, "Apple");
        let c3 = new Company(3, "Microsoft");
        return [c1, c2, c3];
    }
}
class RepositoryService {
    constructor(providers) {
        // on l'exige lors de l'instanciation des providers : une dependance (prend vie dans notre univers)
        //iniciation
        this.providers = providers;
    }
    // heritage
    list() {
        //retourne une liste d'objet Person/Company
        //creer une variable pr recup la liste
        let results = [];
        //parcourir la liste PersonProvider et companyProvider
        for (const p of this.providers) {
            // un provider est un IDataProvider,il n'a que la méthode list. 
            //Bertrand ne connaît pas les Person et Company Providers
            results = results.concat(p.list());
        }
        //afficher la liste
        return results;
    }
    search(text) {
        //retourne une liste :d'objet
        //creer une variable pr recup la liste
        let results = [];
        //parcourir search() de PersonProvider et companyProvider
        for (const p of this.providers) {
            results = results.concat(p.search(text));
        }
        //afficher la liste
        return results;
    }
}
// Là, j'instancie mes objets pour qu'ils puissent jouer leur rôle. 
// jose son type est PersonProvider
const jose = new PersonProvider();
//console.log(jose);
// sophie son type est CompanyProvider
const sophie = new CompanyProvider();
//console.log(sophie);
// bertrand son type est RepositoryService
// lié au constructor pour la Construction
const bertrand = new RepositoryService([jose, sophie]);
//console.log(bertrand.list());
//console.log(bertrand.search('o'));
const express_1 = __importDefault(require("express")); // le mettre dans une variable pr recup tout les exports 
const cors_1 = __importDefault(require("cors"));
//Creation du serveur, par convention on l'appelle app
let app = (0, express_1.default)();
//utilisation du middleware cors// autoriser les requetes HTTP provenant d'une autre origine (nom de domaine)
app.use((0, cors_1.default)());
//utilisation de JSON // communication avc des données au format JSON
app.use(express_1.default.json());
//methode de requete :
// GET (recuperation de données) -search(pr l'exemple, habituellement en GET)
// POST (envoi de données avec une intention de creation)
// PUT (envoi de données avec une intention de modification totale)
// PATCH (envoi de données avec une intention de modification partielle)
// DELETE (suppression de données)
// HEAD (salutation)
// OPTIONS (demande d'autorisation)
// Je crée une fonction pour mes requêtes.
// requete : req
// response : res
app.get('/', function (req, res) {
    //status(202) = succés
    res.status(200).send(bertrand.list());
});
// Creer un nouveau endpoint qui accepte les requêtes en POST avec une donnée "text" à l'interieur du payload
// Renvoyer les resultats de la recherche utilisant la donnée "text" qui a été envoyé.
// Indice : pr recuperer la donnée "text" du payload : req.body.text;
app.post('/search', function (req, res) {
    res.send(bertrand.search(req.body.text));
});
// lancer le serveur avec app.listen// indiquer son port et la fonction
app.listen(4000, function () {
    console.log('listening on port 4000 ok!');
});
//pr verifier que le serveur est bien lancé faire via la console :node index.js, puis lancer localhost:3000.
