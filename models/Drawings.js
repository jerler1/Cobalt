module.exports = function (sequelize, DataTypes) {
  const Drawing = sequelize.define("Drawing", {
    name: { type: DataTypes.STRING },
    link: { type: DataTypes.TEXT },
    user_id: { type: DataTypes.INTEGER },
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
