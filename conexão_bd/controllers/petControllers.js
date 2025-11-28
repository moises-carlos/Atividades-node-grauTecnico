const Pet = require('../models/Pet');

exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pets', error: error.message });
  }
};

exports.createPet = async (req, res) => {
  const { name, type, age, adopted } = req.body;

  if (!name || !type || !age) {
    return res.status(400).json({ message: 'Nome, tipo e idade são obrigatórios.' });
  }

  try {
    const newPet = await Pet.create({ name, type, age, adopted });
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pet', error: error.message });
  }
};


exports.deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Pet.destroy({
      where: { id }
    });

    if (result === 0) {
      return res.status(404).json({ message: `Pet com ID ${id} não encontrado.` });
    }

    res.status(200).json({ message: `Pet com ID ${id} removido com sucesso.` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover pet', error: error.message });
  }
};