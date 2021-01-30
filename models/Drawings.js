module.exports = function (sequelize, DataTypes) {
  const Drawing = sequelize.define("Drawing", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [1, 30],
      },
    },
    link: { type: DataTypes.TEXT, unique: true, allowNull: false },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
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
