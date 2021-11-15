abstract class Entity {
  //modificateur d'accessibilité pour que Bertrand puisse y acceder
  public id: number;
  constructor(id: number){
    this.id = id;
  }
}

class Person extends Entity {
  public firstname: string;
  public lastname: string;
  constructor(id:number,firstname:string, lastname: string){
    super(id)
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

class Company extends Entity {
  public name: string;
  constructor(id:number,name:string){
    super(id)
    this.name = name;  
  }
}

// ne sert pas à créer des objets// c'est l'interface entre nos providers et notre repository
//c'est un mode d'emploi pr nos providers
//aspct commercial: barriere car on ne sait pas ce qui se fait derriere

interface IDataProvider {
  // class abstraite donc je ne remplis pas les fonctions
  list():Entity[];
  search(text: string): Entity[]; 

}

abstract class BaseProvider implements IDataProvider {
  protected abstract getData(): Entity[];// protected car il a des heritiers
  
  public list(): Entity[]{
    //faire preuve d'abstraction
    return this.getData();
  } 

  public search(text:string): Entity[] {
    //retourne une liste :d'objet
    let search:string = text.toLowerCase();
    let results:Entity[] = []; 
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
  protected getData():Entity[] {

    //retourner une liste d'objet Person, text:string
    let p1:Person = new Person(1, "Sophie", "Lozophy"); 

    let p2:Person = new Person(2,"Annie","Versaire" );
    
    let p3:Person = new Person(3,"Paul", "Ochon");

    return [p1, p2, p3];
  }
}

class CompanyProvider extends BaseProvider {
  protected getData():Entity[] {
    
    //retourner une liste d'objet Company
    let c1:Company = new Company(1,"Google" ); 

    let c2:Company = new Company(2,"Apple" ); 

    let c3:Company = new Company(3,"Microsoft"); 
    
    return [c1, c2, c3];
  }
}

class RepositoryService {
  // Dans providers, on a une liste de providers (les objets comme José et Sophie)
  // provider n'est pas une variable mais un attribut ou une propriété de l'objet
  private providers:IDataProvider[]; // private: pck pas besoin d'y toucher, n'a pas d'heritier(pas d'enfant)
  constructor(providers:IDataProvider[]) {
    // on l'exige lors de l'instanciation des providers : une dependance (prend vie dans notre univers)
    //iniciation
    this.providers = providers; 
  }

  // heritage
  public list():Entity[]{
    //retourne une liste d'objet Person/Company
    //creer une variable pr recup la liste
    let results:Entity[] = [];
    //parcourir la liste PersonProvider et companyProvider
    for (const p of this.providers) {
      // un provider est un IDataProvider,il n'a que la méthode list. 
      //Bertrand ne connaît pas les Person et Company Providers
      results = results.concat(p.list());
    }
    //afficher la liste
    return results;
  }

  public search(text:string):Entity[] {
    //retourne une liste :d'objet
    //creer une variable pr recup la liste
    let results:Entity[] = [];
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
const jose:PersonProvider = new PersonProvider();
//console.log(jose);

// sophie son type est CompanyProvider
const sophie:CompanyProvider = new CompanyProvider();
//console.log(sophie);

// bertrand son type est RepositoryService
// lié au constructor pour la Construction
const bertrand:RepositoryService = new RepositoryService([jose, sophie]);
//console.log(bertrand.list());
//console.log(bertrand.search('o'));

import express from 'express'; // le mettre dans une variable pr recup tout les exports 
import cors from 'cors'; 

//Creation du serveur, par convention on l'appelle app
let app = express();
//utilisation du middleware cors// autoriser les requetes HTTP provenant d'une autre origine (nom de domaine)
app.use(cors());
//utilisation de JSON // communication avc des données au format JSON
app.use(express.json());

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
app.get('/',function(req,res) {
    //status(202) = succés
    res.status(200).send(bertrand.list());
});

// Creer un nouveau endpoint qui accepte les requêtes en POST avec une donnée "text" à l'interieur du payload
// Renvoyer les resultats de la recherche utilisant la donnée "text" qui a été envoyé.
// Indice : pr recuperer la donnée "text" du payload : req.body.text;

app.post('/search', function(req, res){
    res.send(bertrand.search(req.body.text));
});


// lancer le serveur avec app.listen// indiquer son port et la fonction
app.listen(4000, function() {
    console.log('listening on port 4000 ok!')
})
//pr verifier que le serveur est bien lancé faire via la console :node index.js, puis lancer localhost:3000.