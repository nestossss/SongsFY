
var client_id = '636dc7a277084df097b1a5f8e6fc2df6';
var client_secret = '2420e0a7746742ca8b373fdbd9cfab2f';
const credentials = `${client_id}:${client_secret}`;
const base64Credentials = btoa(credentials);

/* ---------- TOKEN DE ACESSO --------------*/


var authOptions = {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + base64Credentials,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
};
try {
  const response = fetch('https://accounts.spotify.com/api/token', authOptions);
  const token = response.json();
} catch (error) {
  console.error('Erro token (provavelmente sem net)', error);
  throw error;
}
const token = getToken();

/* ---------- GET SEARCH ---------- */

async function search(){
  try{
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
    console.error('espere', error);
  }
}

/* ---------- PESQUISA ---------- */

let pesquisa;
const inputPesquisa = document.getElementById('txtBusca');

inputPesquisa.addEventListener('input', async () => {
    if (inputPesquisa.value)
    {
      pesquisa = inputPesquisa.value;
      var resultados = await search();
        for (var i = 0; i <= 5; i++)
        {
        var divResultados = document.getElementById('resultado'+i);
        if (resultados.tracks.items.length >= 5)
          divResultados.innerHTML = resultados['tracks'].items[i].name;
        }
    }
});

/* ----------- ESCOLHA ----------- */

var trackSeed;

function escolha(selecionado){
  var track = resultados.tracks.items[selecionado];
  var artists = [];

  const nomeSelecionado = document.getElementById('selecionado-nome');
  const albumSelecionado = document.getElementById('selecionado-album');
  const artistasSelecionado = document.getElementById('selecionado-artistas');

  var trackInfo = [track.name, track.album.name, artists]
  trackSeed = track.id;
  for (var i = 0; i < track.artists.length; i++)
  {
    artists.push(track.artists[i].name);
  }
  nomeSelecionado.innerHTML = 'Nome: ' + track.name;
  albumSelecionado.innerHTML = 'Álbum: ' + track.album.name;
  artistasSelecionado.innerHTML = 'Artistas: ' +artists;

  console.log(trackInfo);
  console.log(track);
}

/* -------- GET RECOMMENDATIONS --------*/

async function recommendations(){
  try {
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
    console.error('esperar', error);
  }
}

var botao = document.getElementById('botao');
botao.addEventListener('click', () =>{
  recommendations();
});

/* sla meio q um raschunho * /

// Se der tempo diferenciar single de album, pra aparecer escrito "Single" ao inves do nome do album


/* --- const token = await getToken(); --- */
