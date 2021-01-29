module.exports = function (sequelize, DataTypes) {
  const Drawing = sequelize.define("Drawing", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
        len: [1, 30],
      },
    },
    link: { type: DataTypes.TEXT, aloowNull: false },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [1, 6],
      },
    },
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
