const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const deleteOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.destroy({ where: { id: req.params.id } });
  if (doc === 0) return next(new AppError("No se encontró el documento con esa identificación", 404));

  res.status(204).json({
    status: "Successful",
    data: doc,
    message: "Documento eliminado"
  });
});

const updateOne = (Model) => catchAsync(async (req, res, next) => {
  /*const [rowsUpdated, [updatedDoc]] = await Model.update(req.body, {
    where: { id: req.params.id },
    returning: true, // To return the updated document
    individualHooks: true // To execute validators in hooks before updating
  });*/
  if(req.body.user)return next(new AppError("En esta ruta no se puede modificar el campo user",401));
  const datos = await Model.update(req.body, {
    where: { id: req.params.id },
    returning: true, // To return the updated document
  });

  if (datos[1] === 0) {
    return next(new AppError("No se encontró el documento con esa identificación", 404));
  }

  let query = Model.findByPk(req.params.id);
  const doc = await query;

  res.status(200).json({
    status: "success",
    data: {
      data: doc
    }
  });
});


const createOne = (Model) => catchAsync(async (req, res, next) => {
  const newDoc = await Model.create(req.body);
  res.status(201).json({
    status: "successful",
    data: { data: newDoc },
  });
});

const getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  let query = Model.findByPk(_id);
  if (populateOptions) {
    query = query.include(populateOptions);
  }
  const doc = await query;

  if (!doc) return next(new AppError("No se encontró un documento con esa identificación", 404));

  res.status(200).json({
    status: "success",
    requestAt: req.requestTime,
    data: { data: doc }
  });
});


const getAll = (Model) => catchAsync(async (req, res) => {
  const pageModel = parseInt(req.query.page) || 1; // Página actual, por defecto 1
  const limitModel = parseInt(req.query.limit) || 10; // Límite de registros por página, por defecto 10
  const offset = (pageModel - 1) * limitModel; // Cálculo del desplazamiento (offset)
  const { page, limit, ...fields } = req.query;
  console.log(fields)
  const { count, rows } = await Model.findAndCountAll({
    offset: offset,
    limit: limitModel,
    where: fields, 
  });

  const totalPages = Math.ceil(count / limitModel); // Cálculo del total de páginas

  res.status(200).json({
    status: "successful",
    requestAt: req.requestTime,
    data: rows,
    page: pageModel,
    limit: limitModel,
    totalPages: totalPages,
    totalRecords: count,
  });
});



module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
