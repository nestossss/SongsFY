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
 
for (var i = 0; i <= 7; i++)
{
  document.getElementById('resultado'+i).style.display = 'none';
}
setInterval( ()=> {
  if(!inputPesquisa.value)
  {
    document.getElementById('intro').style.display = 'flex';
    for (var i = 0; i <= 7; i++)
    {
      document.getElementById('resultado'+i).style.display = 'none';
    }
  }
}, 2000);

inputPesquisa.addEventListener('input', async () => {
    const divSelecionado= document.getElementById('selecionado');
    if (!inputPesquisa.value)
    {
      document.getElementById('sem-resultado').style.display = 'none';
      document.getElementById('intro').style.display = 'flex';
      divSelecionado.style.display = 'none';
      for (var i = 0; i <= 7; i++)
      {
        document.getElementById('resultado'+i).style.display = 'none';
      } 
    }
    else
    {
      document.getElementById('intro').style.display = 'none';
      pesquisa = inputPesquisa.value;
      await search();
      var contRes = 0;
      for (var i = 0; i <= 7; i++)
      {
        try{
          document.getElementById('sem-resultado').style.display = 'none';
          document.getElementById('resultado'+i).style.display = 'flex';
          var divResultado = document.getElementById('resultado'+i);
          divResultado.innerHTML = '';

          var fotoMusica = document.createElement('img');
          fotoMusica.id = 'resultado-img'+i;
          fotoMusica.src = resultados['tracks'].items[i].album.images[2].url;

          var nomeMusica = document.createElement('div');
          nomeMusica.id = 'resultado-info'+i;
          nomeMusica.classList = 'resultados-info';

          var artists = [];
          for (var j = 0; j < resultados['tracks'].items[i].artists.length; j++)
          {
            artists.push(resultados['tracks'].items[i].artists[j].name);
          }

          nomeMusica.innerHTML = `<p class="resultado-nome">${resultados['tracks'].items[i].name}</p>
                                  <p class="resultado-artista">${artists}</p>`

          divResultado.appendChild(fotoMusica);
          divResultado.appendChild(nomeMusica);
        }
        catch{
          document.getElementById('resultado'+i).style.display = 'none';
          contRes++;
        }
      }
      if (contRes == 8)
      {
        document.getElementById('sem-resultado').style.display = 'flex';
      }
      divSelecionado.style.display = 'none';
    }
});

/* ----------- escolha ----------- */

var trackSeed;
function escolha(selecionado){
  var track = resultados.tracks.items[selecionado];
  var artists = [];
  let strArtists = " ";
  
  const divSelecionado= document.getElementById('selecionado');
  const nomeSelecionado = document.getElementById('selecionado-titulo');
  const albumSelecionado = document.getElementById('selecionado-album');
  const artistasSelecionado = document.getElementById('selecionado-artistas');
  const imgSelecionado = document.getElementById('selecionado-img');
  const botaoLink = document.getElementById('link-spotify');

  divSelecionado.style.display = 'flex';
  for(var i = 4; i <= 7; i++)
  {
    var selecResultados = document.getElementById('resultado'+i);
    selecResultados.style.display = 'none';
  }

  trackSeed = track.id;

  for (var i = 0; i < track.artists.length; i++)
  {
    artists.push(track.artists[i].name);
    strArtists += artists[i];
  }
  if (track.name.length <= 22){
    nomeSelecionado.innerHTML = track.name;
  }else{
    nomeSelecionado.innerHTML = `<abbr title="${track.name}">${track.name}</abbr>`;
  }
  if (track.album.name.length <= 38){
    albumSelecionado.innerHTML = track.album.name;
  }else{
    albumSelecionado.innerHTML = `<abbr title="${track.album.name}">${track.album.name}</abbr>`;
  }
  if (strArtists.length <= 38){
    artistasSelecionado.innerHTML = artists;
  }else{
    artistasSelecionado.innerHTML = `<abbr title="${artists}">${artists}</abbr>`;
  }
  imgSelecionado.src = track.album.images[0].url;
  botaoLink.href = track.external_urls.spotify;
}

/* -------- GET RECOMMENDATIONS --------*/
var recommendationsList;
async function recommendations(){
  try {
    const token = await getToken();
    var apiUrlR = `https://api.spotify.com/v1/recommendations?limit=10&seed_tracks=${trackSeed}`;
    var authOptions = {
      headers: {
        'Authorization': 'Bearer ' + token
        }
    };
    const response = await fetch(apiUrlR, authOptions);
    if (!response.ok) {
      throw new Error('Erro na solicitação da API do Spotify');
    }
    recommendationsList = await response.json();
    console.log('FOR YOUUUUU:', recommendationsList);
    return recommendationsList;

  } catch (error) {
    console.error('erro recomendação', error);
  }
}

var botao = document.getElementById('botao-recomendacao');
botao.addEventListener('click', async () =>{
  await recommendations();
  console.log(recommendationsList);
  for(var i = 0; i <= 9; i++){
    
    var recomendacao = document.getElementById('musica'+i);
    var recomendacaoNome = recommendationsList.tracks[i].name;
    var recomendacaoArtista = [];
    for (var j = 0; j < recommendationsList.tracks[i].artists.length; j++)
    {
      recomendacaoArtista.push(recommendationsList.tracks[i].artists[j].name);
    }
    var recomendacaoImg = recommendationsList.tracks[i].album.images[2].url;

    recomendacao.innerHTML = `<img src="${recomendacaoImg}">\n
                              <div class="recomendacao-info">\n
                                <p class="recomendacao-nome">${recomendacaoNome}</p>\n
                                <p class="recomendacao-artista">${recomendacaoArtista}</p>\n
                              </div>`
    recomendacao.href = recommendationsList.tracks[i].external_urls.spotify;
  }
  const txtBusca = document.getElementById('txtBusca');
  txtBusca.style.display = 'none';
  const divBusca = document.getElementById('divBusca');
  divBusca.style.display = 'none';
  const listaRecomendacao = document.getElementById('lista-recomendacoes');
  listaRecomendacao.style.display = 'flex';
  const botaoVoltar = document.getElementById('voltar');
  botaoVoltar.addEventListener('click', () => {
    divBusca.style.display = 'grid';
    listaRecomendacao.style.display ='none';
    txtBusca.style.display = 'flex';
    
  })
});