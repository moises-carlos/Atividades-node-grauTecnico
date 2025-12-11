// usei o dChrome DevTools mas é meio esquisito


const fs = require("fs");

const mensagem = "Processamento concluído!";

function carregarUsuarios() {
  fs.readFile("usuarios.json", "utf8", (err, dados) => {
    if (err) {
      console.log("Erro ao ler o arquivo:", err.message);
    } else {
      try {
        const usuarios = JSON.parse(dados);
        filtrarUsuarios(usuarios);
        exibirMensagem();
      } catch (error) {
        console.log("Erro ao converter JSON:", error.message);
      }
    }
  });
}

function filtrarUsuarios(lista) {
  const resultado = lista.filter((usuario) => usuario.idade > 18);
  console.log("Usuários maiores de idade:");
  resultado.forEach((u) => {
    console.log(`- ${u.nome} (${u.idade} anos)`);
  });
}

function exibirMensagem() {
  console.log(mensagem);
}

function main() {
  carregarUsuarios();
}

main();

/*
- utilizou a variável mensagem sem tê-la declarado.

- chamou exibirMensagem() antes da leitura do arquivo terminar, causando execução fora de ordem.

- não tratou possíveis erros ao usar JSON.parse().

- não adicionou proteção contra dados inválidos vindos do arquivo.
*/
