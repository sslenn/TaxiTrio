const { Vehicle, User } = require('../../models');

const getAll = async () =>
  Vehicle.findAll({
    include: [{ model: User, as: 'driver', attributes: ['id', 'full_name'] }],
    order: [['created_at', 'DESC']],
  });

const create = async (data) => Vehicle.create(data);

const update = async (id, data) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) throw { status: 404, message: 'Vehicle not found' };
  await vehicle.update(data);
  return vehicle;
};

const remove = async (id) => Vehicle.destroy({ where: { id } });

module.exports = { getAll, create, update, remove };
