module.exports = function (sequelize, DataTypes) {
  const Drawing = sequelize.define('Drawing', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
        len: [1, 30],
      },
    },
    link: { type: DataTypes.TEXT, allowNull: false },
  });

  Drawing.associate = function (models) {
    // Associating a single Drawing with a User.
    Drawing.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Drawing;
};
