module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
        isAlphanumeric: true,
      },
    },
  });

  User.associate = function (models) {
    // Associating User with Drawings.
    // When a user is deleted, delete all their drawings.
    User.hasMany(models.Drawing, {
      onDelete: "cascade",
    });
  };

  return User;
};
