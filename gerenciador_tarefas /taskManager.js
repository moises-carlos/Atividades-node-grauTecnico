const EventEmitter = require("events");

class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = {};


    this.on("taskCreated", (nome) => {
      console.log(`[EVENTO] Tarefa criada: ${nome}`);

      const timeout = setTimeout(() => {
        this.emit("taskCompleted", nome);
      }, 30000); 

      this.tasks[nome] = {
        nome,
        status: "pendente",
        timeout
      };
    });

    this.on("taskCompleted", (nome) => {
      const task = this.tasks[nome];
      if (!task || task.status !== "pendente") return;

      task.status = "concluída";
      console.log(`[EVENTO] Tarefa concluída automaticamente: ${nome}`);
    });

    this.on("taskCancelled", (nome) => {
      const task = this.tasks[nome];
      if (!task || task.status !== "pendente") return;

      clearTimeout(task.timeout);
      task.status = "cancelada";
      console.log(`[EVENTO] Tarefa cancelada: ${nome}`);
    });
  }

  listarTarefas() {
    console.log("\n📌 Lista de tarefas:");
    for (let nome in this.tasks) {
      const t = this.tasks[nome];
      console.log(`- ${t.nome}: ${t.status}`);
    }
    console.log("");
  }
}

const manager = new TaskManager();

manager.emit("taskCreated", "Tarefa A");
manager.emit("taskCreated", "Tarefa B");

setTimeout(() => {
  manager.emit("taskCancelled", "Tarefa B");
}, 10000);

setTimeout(() => {
  manager.listarTarefas();
}, 5000);

module.exports = TaskManager;
