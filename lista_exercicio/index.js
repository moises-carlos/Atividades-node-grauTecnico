function buscarDadosDoServidor() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, dados: "OK" });
    }, 2000);
  });
}

async function testarBusca() {
  const resultado = await buscarDadosDoServidor();
  console.log("1.", resultado);
}
testarBusca();
 //-----------------
 function validarIdade(idade) {
  return new Promise((resolve, reject) => {
    if (idade >= 18) {
      resolve("Acesso permitido");
    } else {
      reject("Acesso negado");
    }
  });
}

async function testarIdades() {
  try {
    console.log("2.", await validarIdade(20));
  } catch (err) {
    console.log("2.", err);
  }

  try {
    console.log("2.", await validarIdade(15));
  } catch (err) {
    console.log("2.", err);
  }
}
testarIdades();
//---------------------
function baixarImagem() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Imagem baixada"), 2000);
  });
}

function baixarVideo() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Vídeo baixado"), 3000);
  });
}

async function baixarMidias() {
  const resultados = await Promise.all([baixarImagem(), baixarVideo()]);
  console.log("3.", resultados);
}
baixarMidias();
//----------------------
function fazerLogin(usuario, senha) {
  return new Promise((resolve, reject) => {
    if (usuario === "admin" && senha === "1234") {
      resolve("Login bem-sucedido");
    } else {
      reject("Credenciais inválidas");
    }
  });
}

async function testarLogin() {
  try {
    console.log("4.", await fazerLogin("admin", "1234"));
  } catch (err) {
    console.log("4.", err);
  }

  try {
    console.log("4.", await fazerLogin("user", "9999"));
  } catch (err) {
    console.log("4.", err);
  }
}
testarLogin();
 //-----------------------
 function getUsuario() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 5, nome: "João" }), 1000);
  });
}

function getPedidos(idUsuario) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { pedido: 1, item: "Livro" },
        { pedido: 2, item: "Mouse" },
      ]);
    }, 1500);
  });
}

async function mostrarPedidos() {
  const usuario = await getUsuario();
  const pedidos = await getPedidos(usuario.id);

  console.log("5. Usuário:", usuario.nome);
  console.log("5. Pedidos:", pedidos);
}
mostrarPedidos();
//---------------------
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function contarAte(numero) {
  for (let i = 1; i <= numero; i++) {
    console.log("6.", i);
    await delay(1000);
  }
}
contarAte(5);
//---------------------
function buscarComTimeout() {
  const busca = new Promise((resolve) => {
    setTimeout(() => resolve("Dados recebidos"), 2000);
  });

  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject("Tempo esgotado"), 1000);
  });

  return Promise.race([busca, timeout]);
}

async function testarTimeout() {
  try {
    console.log("7.", await buscarComTimeout());
  } catch (err) {
    console.log("7.", err);
  }
}
testarTimeout();
//-------------------------
function promessa1() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Resolveu em 1s"), 1000);
  });
}

function promessa2() {
  return new Promise((_, reject) => {
    setTimeout(() => reject("Rejeitou em 2s"), 2000);
  });
}

function promessa3() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Resolveu em 0.5s"), 500);
  });
}

async function verificarResultados() {
  const resultados = await Promise.allSettled([
    promessa1(),
    promessa2(),
    promessa3(),
  ]);

  console.log("8.", resultados);
}
verificarResultados();
