//Main variables
let url = 'https://swapi.dev/api/planets/';
let generalList = [];
let planetData = [];
let next = '';
let plainUrl = '';
let modal = document.getElementById("modal");
let loadMore = false;

//Methods
//Fetch api to get planet list
function getData(url){
  planetList = '';
   fetch(url)
    .then(response => response.json())
    .then(json => {
        planetList = json.results
        //Loop through planetList and add individual items to generalList
       for(const property in planetList){
           generalList.push(planetList[property])
       }
       printData(generalList)
       if(json.next){
        next = json.next.replace('http', 'https');
       }else {
        next = '';
       }
       loadMore = true;
    })
    .catch(error => {
        document.getElementById('root').innerHTML = '<div class="error"><img class="error__image" src="https://www.freeiconspng.com/uploads/star-wars-png-file-31.png" alt="Space Ship" /><p class="error__message">We are having problems showing the planets</p></div>';
        console.error("There was an error!", error);
    }); 
};

//Fetch api to get planet data
function getPlanet(url){
   fetch(url)
    .then(response => response.json())
    .then(json => {
        planetData = json
        date = moment(planetData.created).format("MMM Do YY");
        printPlanet(planetData);
    })
    .catch(error => {
        console.error("There was an error!", error);
    }); 
};

//Push list data to main document
function printData(result){
    let planetList = '';
    for(i=0; i<result.length; i++){
        itemUrl = result[i].url
        planetList+=    '<div class="planet"><span class="planet__init">Planet</span><div class="planet__title">'
                            + result[i].name
                            + '</div><div class="planet-info"><div class="planet-info__population"><span>Population:</span> ' 
                            + result[i].population
                            + '</div><div class="planet-info__terrain"><span>Terrain:</span> '
                            + result[i].terrain
                            + '</div><div class="planet-info__movies"><span>Films:</span> '
                            + result[i].films.length
                            + '</div><button class="planet-info__button" value="'
                            + itemUrl
                            + '" onclick="showDetail()">More info</button>'
                        + '</div></div>';
    }
    document.getElementById('root').innerHTML = planetList;
}

//Push planet data to show details
function printPlanet(result){
  let planetInfo = '<div class="card__title"><span>Planet details</span><h2>'
                    + result.name
                    + '</h2></div><div class="card__info"><div class="card__info-item"><p class="label">Climate</p><p class="data">'
                    + result.climate
                    + '</p></div><div class="card__info-item"><p class="label">Created</p><p class="data">'
                    + result.date
                    + '</p></div><div class="card__info-item"><p class="label">Diameter</p><p class="data">'
                    + result.diameter
                    + '</p></div><div class="card__info-item"><p class="label">Gravity</p><p class="data">'
                    + result.gravity
                    + '</p></div><div class="card__info-item"><p class="label">Orbital period</p><p class="data">'
                    + result.orbital_period
                    + '</p></div><div class="card__info-item"><p class="label">Population</p><p class="data">'
                    + result.population
                    + '</p></div><div class="card__info-item"><p class="label">Rotation period</p><p class="data">'
                    + result.rotation_period
                    + '</p></div><div class="card__info-item"><p class="label">Terrain</p><p class="data">'
                    + result.terrain
                    + '</p></div>';
  document.getElementById('planetInfo').innerHTML = planetInfo;
}

//Get planet url and show modal with data
function showDetail(){
  document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        plainUrl = target.value;   
        getPlanet(plainUrl)
  }, false);
  modal.style.display = 'block';
}

//Add next 10 planets when the user reach the end of the page
function scroll() {
    window.onscroll = () => {
        let bottomOfWindow = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
        if (bottomOfWindow) {
            //If is there more data
            if(next && loadMore){
                getData(next);
                bottomOfWindow = false;
                loadMore = false;
            }
        }
    } 
}

//Close modal
function closeModal(){
  modal.style.display = 'none';
}

//Order planets by population
function orderPopulation(){
  generalList = generalList.sort(function (a, b) { 
    if(a.population == 'unknown'){
      a.population = 0;
    }else if(b.population == 'unknown'){
      b.population = 0;
    }
    if (a.population < b.population) {
      return -1;
    }
    if (a.population > b.population) {
      return 1;
    }
    return 0;
  });
  printData(generalList)
}

//Order planets by name
function orderPlanets(){
  generalList = generalList.sort(function(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  printData(generalList)
}

//Initialize
getData(url);
scroll();