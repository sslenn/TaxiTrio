const { Route } = require('../../models');

const getAll = async () =>
  Route.findAll({ where: { is_active: true }, order: [['origin', 'ASC'], ['destination', 'ASC']] });

const create = async (data) => Route.create(data);

const update = async (id, data) => {
  const route = await Route.findByPk(id);
  if (!route) throw { status: 404, message: 'Route not found' };
  await route.update(data);
  return route;
};

module.exports = { getAll, create, update };
