module.exports = function (sequelize, DataTypes) {
  const Art = sequelize.define("Art", {
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    link: DataTypes.STRING,
  });

  return Art;
};
