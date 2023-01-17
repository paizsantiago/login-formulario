 const fs = require('fs');

class Contenedor {
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }

    save = async (objeto) =>{
        try {   
            if (fs.readFileSync(this.nombreArchivo, 'utf-8') === "") {
                fs.writeFileSync(this.nombreArchivo, "[]");
            }
            const productos = await this.getAll();
            const id =
                productos.length === 0
                    ? 1
                    : productos[productos.length - 1].id + 1;
            objeto.id = id;
            let fileData = await JSON.parse(fs.readFileSync(this.nombreArchivo));
            let newData = [...fileData, objeto]
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(newData, null, 2));
        } catch (error) {
            console.log(error);
        }
    }


    getById  = (id) =>{
        try {
            const resultado = fs.readFileSync(this.nombreArchivo, 'utf-8');
            const obj = JSON.parse(resultado);
            const objetoPedido = obj.find(item => item.id === id);
            if (objetoPedido != undefined) {
                return objetoPedido;
            }else{
                return "El producto no existe";
            }
        } catch (error) {
            console.log("Error");
        }
    }

    updateById = (id, titulo, precio, thumbnail) => {
        try {
            const productos =  this.getAll();
            const isInProductList = productos.find(prod => Number(prod.id) === Number(id));
            const indexItem = productos.findIndex((prod) => Number(prod.id) === Number(id));
            if (isInProductList != undefined) {
                const objeto = { id: id, titulo: titulo, precio: precio, thumbnail: thumbnail};
                productos[indexItem] = objeto;
                console.log(objeto);
                 fs.writeFileSync(
                    this.nombreArchivo,
                    JSON.stringify(productos, null, 2)
                );
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("error");
        }
    };


    getAll = async () => await JSON.parse(fs.readFileSync(this.nombreArchivo));
    

    deteleById = (id) =>{
        try {
            const resultado = fs.readFileSync(this.nombreArchivo, 'utf-8');
            const obj = JSON.parse(resultado);
            id--;
            obj.splice(id, 1);
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(obj, null, 2)) 
            return obj;
        } catch (error) {
            console.log("Error id no encontrado");
        }
    }

    deteleAll = () =>{
        fs.writeFileSync(this.nombreArchivo, "");
    }

}

module.exports = Contenedor;