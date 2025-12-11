class Playlist {
  constructor(musicas = []) {
    this.musicas = musicas;
  }

  adicionarMusica(nome) {
    this.musicas.push(nome);
  }

  *[Symbol.iterator]() {
    for (const musica of this.musicas) {
      yield musica;
    }
  }
}

const minhaPlaylist = new Playlist([
  "Bohemian Rhapsody",
  "Stairway to Heaven",
  "Hotel California",
]);

minhaPlaylist.adicionarMusica("Smells Like Teen Spirit");

console.log("Músicas na playlist:");
for (const musica of minhaPlaylist) {
  console.log(musica);
}
