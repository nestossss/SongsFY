var client_id = '636dc7a277084df097b1a5f8e6fc2df6';
var client_secret = '2420e0a7746742ca8b373fdbd9cfab2f';
//Sera que da pra deixar esses dois assim msm? pq na teoria nao devia ta expostokkkk

const credentials = `${client_id}:${client_secret}`;
const base64Credentials = btoa(credentials);

/* ---------- TOKEN DE ACESSO --------------*/

async function getToken() {
  var authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + base64Credentials,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const token = await response.json();
    return token.access_token;
  } catch (error) {
    console.error('Erro token (provavelmente sem net)', error);
    throw error;
  }
}

/* ---------- GET SEARCH ---------- */
var resultados;
async function search(){
  try{
    const token = await getToken();
    var apiUrlS = `https://api.spotify.com/v1/search?q=${pesquisa}&type=track&include_external=audio`;
    var authOptions = {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
    var response = await fetch(apiUrlS, authOptions);
    resultados = await response.json();
    return resultados;
  } catch(error) {
    console.error('erro search', error);
  }
}

/* ---------- pesquisa ---------- */

let pesquisa;
const inputPesquisa = document.getElementById('txtBusca');
const htmlMain = document.getElementById('principal');

for (var i = 0; i <= 7; i++)
{
  document.getElementById('resultado'+i).style.display = 'none';
}
setInterval( ()=> {
  if(!inputPesquisa.value)
  {
    for (var i = 0; i <= 7; i++)
    {
      document.getElementById('resultado'+i).style.display = 'none';
    }
  }
}, 500);

inputPesquisa.addEventListener('input', async () => {
    if (!inputPesquisa.value)
    {
      for (var i = 0; i <= 7; i++)
      {
        document.getElementById('resultado'+i).style.display = 'none';
      } 
    }
    else
    {
      htmlMain.scrollIntoView({block: "start",  behavior: "smooth" });
      pesquisa = inputPesquisa.value;
      await search();
      for (var i = 0; i <= 7; i++)
      {
        try{
          document.getElementById('resultado'+i).style.display = 'flex';
          var divResultado = document.getElementById('resultado'+i);
          divResultado.innerHTML = '';

          var fotoMusica = document.createElement('img');
          fotoMusica.id = 'resultado-img'+i;
          fotoMusica.src = resultados['tracks'].items[i].album.images[2].url;

          var nomeMusica = document.createElement('p');
          nomeMusica.id = 'resultado-nome'+i;
          nomeMusica.innerHTML = resultados['tracks'].items[i].name;

          divResultado.appendChild(fotoMusica);
          divResultado.appendChild(nomeMusica);
        }
        catch{
          document.getElementById('resultado'+i).style.display = 'none';
        }
      }
    }
});

/* ----------- escolha ----------- */

var trackSeed;
function escolha(selecionado){
  var track = resultados.tracks.items[selecionado];
  var artists = [];

  const nomeSelecionado = document.getElementById('selecionado-nome');
  const albumSelecionado = document.getElementById('selecionado-album');
  const artistasSelecionado = document.getElementById('selecionado-artistas');

  trackSeed = track.id;
  var trackInfo = [track.name, track.album.name, artists]

  for (var i = 0; i < track.artists.length; i++)
  {
    artists.push(track.artists[i].name);
  }
  nomeSelecionado.innerHTML = 'Nome: ' + track.name;
  albumSelecionado.innerHTML = 'Álbum: ' + track.album.name;
  artistasSelecionado.innerHTML = 'Artistas: ' + artists;

  console.log(trackInfo);
  console.log(track);
}

/* -------- GET RECOMMENDATIONS --------*/

async function recommendations(){
  try {
    const token = await getToken();
    var apiUrlR = `https://api.spotify.com/v1/recommendations?seed_tracks=${trackSeed}`;
    var authOptions = {
      headers: {
        'Authorization': 'Bearer ' + token
        }
    };
    const response = await fetch(apiUrlR, authOptions);
    if (!response.ok) {
      throw new Error('Erro na solicitação da API do Spotify');
    }
    const recommendations = await response.json();
    console.log('FOR YOUUUUU:', recommendations);

    for (var i = 0; i <=9; i++)
    {
      var divMusica = document.getElementById('musica'+i);
      divMusica.innerHTML = recommendations.tracks[i].name;
    }

  } catch (error) {
    console.error('erro recomendação', error);
  }
}

var botao = document.getElementById('botao');
botao.addEventListener('click', () =>{
  recommendations();
});

/* ------------ sla meio q um raschunho  -------------*/

/*
  
*/

// colocar foto das musica,
// se der tempo ver se da p diferenciar single de album
