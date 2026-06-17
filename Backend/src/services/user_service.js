const { User, Vehicle } = require('../../models');

const getAllUsers = async () =>
  User.findAll({ attributes: { exclude: ['password'] }, order: [['created_at', 'DESC']] });

const updateProfile = async (id, { full_name, phone, avatar_url }) => {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: 'User not found' };
  await user.update({ full_name, phone, avatar_url });
  const { password: _, ...data } = user.toJSON();
  return data;
};

const toggleUserStatus = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: 'User not found' };
  await user.update({ is_active: !user.is_active });
  return { id: user.id, is_active: user.is_active };
};

const getAllDrivers = async () =>
  User.findAll({
    where: { role: 'driver' },
    attributes: { exclude: ['password'] },
    include: [{ model: Vehicle, as: 'vehicles', attributes: ['plate_number', 'type', 'brand', 'model', 'is_available'] }],
    order: [['full_name', 'ASC']],
  });

module.exports = { getAllUsers, updateProfile, toggleUserStatus, getAllDrivers };
