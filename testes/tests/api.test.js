const request = require("supertest");
let app;

beforeEach(() => {
  jest.resetModules();
  app = require("../server"); 
});


describe("Autenticação", () => {

  test("Deve cadastrar um novo usuário (201)", async () => {
    const res = await request(app)
      .post("/register")
      .send({ email: "teste@example.com", senha: "123" });

    expect(res.status).toBe(201);
  });

  test("Não deve permitir cadastrar com email duplicado (400)", async () => {
    await request(app)
      .post("/register")
      .send({ email: "dup@example.com", senha: "123" });

    const res = await request(app)
      .post("/register")
      .send({ email: "dup@example.com", senha: "123" });

    expect(res.status).toBe(400);
  });

  test("Deve permitir logar corretamente (200)", async () => {
    await request(app)
      .post("/register")
      .send({ email: "login@example.com", senha: "123" });

    const res = await request(app)
      .post("/login")
      .send({ email: "login@example.com", senha: "123" });

    expect(res.status).toBe(200);
  });

  test("Não deve permitir logar com senha incorreta (400)", async () => {
    await request(app)
      .post("/register")
      .send({ email: "login2@example.com", senha: "123" });

    const res = await request(app)
      .post("/login")
      .send({ email: "login2@example.com", senha: "errado" });

    expect(res.status).toBe(400);
  });

});

describe("Notas", () => {

  let agent;

  beforeEach(async () => {

    agent = request.agent(app);

    await agent
      .post("/register")
      .send({ email: "user@teste.com", senha: "123" });

    await agent
      .post("/login")
      .send({ email: "user@teste.com", senha: "123" });
  });

  test("Não permitir acessar notas sem sessão ativa (401)", async () => {
    const res = await request(app).get("/notas");
    expect(res.status).toBe(401);
  });

  test("Adicionar nova nota com sessão ativa (201)", async () => {
    const res = await agent
      .post("/notas")
      .send({ nomeAluno: "Maria", nota: 9 });

    expect(res.status).toBe(201);
  });

  test("Não permitir adicionar nota fora do intervalo (400)", async () => {
    const res = await agent
      .post("/notas")
      .send({ nomeAluno: "João", nota: 11 });

    expect(res.status).toBe(400);
  });

  test("Listar todas as notas do usuário atual (200)", async () => {
    await agent.post("/notas").send({ nomeAluno: "Ana", nota: 8 });
    await agent.post("/notas").send({ nomeAluno: "Ana", nota: 10 });

    const res = await agent.get("/notas");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("Retornar média correta para um aluno (200)", async () => {
    await agent.post("/notas").send({ nomeAluno: "Pedro", nota: 6 });
    await agent.post("/notas").send({ nomeAluno: "Pedro", nota: 8 });

    const res = await agent.get("/notas/Pedro/media");

    expect(res.status).toBe(200);
    expect(res.body.media).toBe(7);
  });

  test("Retornar 404 para aluno não encontrado", async () => {
    const res = await agent.get("/notas/Desconhecido/media");
    expect(res.status).toBe(404);
  });

});
