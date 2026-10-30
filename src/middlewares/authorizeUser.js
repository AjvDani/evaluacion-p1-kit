const authorizeUser = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ error: "El id del usuario debe ser un número entero" });
  }

  const isOwner = id === req.user.id;
  const isAdmin = req.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ error: "No autorizado para acceder a este usuario" });
  }

  req.params.id = id;
  next();
};

module.exports = authorizeUser;
