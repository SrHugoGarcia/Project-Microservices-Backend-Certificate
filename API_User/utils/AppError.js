class AppError extends Error{
    //Aceptara el mensaje del error y el status
    constructor(message, statusCode){

        super(message);
        this.statusCode = statusCode;
        //startsWith retorna un true o false
        //true si el status code empieza en 4 y sera fail 
        //False si el status no comienza en 4 o nada y sera err
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        //Denominamos isOperacional ya que son todos los errores que podemos 
        //predecir y diferenciarlos de los errores internos
        this.isOperacional = true;
        //Capturaremos el siguimiento de la pila err.stack nos dice en donde ocurrio
        // el error y manda un mensaje
        //Queremos conservar eso por si es un error interno pero no tenerlo aqui
        //Por lo tanto esto nos ayuda a no cantaminar nuetra clase xd
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;