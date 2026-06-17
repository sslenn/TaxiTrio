const { TransportationPackage } = require('../../models');

const getAll = async () =>
  TransportationPackage.findAll({ where: { is_active: true }, order: [['price', 'ASC']] });

const create = async (data) => TransportationPackage.create(data);

const update = async (id, data) => {
  const pkg = await TransportationPackage.findByPk(id);
  if (!pkg) throw { status: 404, message: 'Package not found' };
  await pkg.update(data);
  return pkg;
};

const getById = async (id) => {
  const pkg = await TransportationPackage.findByPk(id);
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return pkg;
};

module.exports = { getAll, create, update, getById };
