const { faker } = require("@faker-js/faker");
faker.locale = "es";

let timestamp = new Date().toLocaleString();
const createProduct = () => {
  return {
    price: faker.commerce.price(
      (min = 1),
      (max = 1000),
      (dec = 2),
      (symbol = "")
    ),
    titulo: faker.vehicle.vehicle(),
    timestamp,
    descripcion: faker.vehicle.vehicle(),
    thumbnail: faker.image.transport(
      (width = 640),
      (height = 480),
      (randomize = true)
    ),
  };
};

const createNProducts = (array, cant) =>{
    for (let index = 0; index < cant; index++) {
        array.push(createProduct());
    }
};

module.exports = {createNProducts};