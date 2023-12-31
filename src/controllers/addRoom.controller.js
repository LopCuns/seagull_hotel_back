import validateAdmin from '#Validations/validateAdmin.js'
import RoomModel from '#Schemas/room.schema.js'
import { CONFLICT, UNAUTHORIZED } from '#Validations/errors/server.errors.js'

const addRoomController = async (req, res) => {
  const { roomType, roomName, reservations, masterKey } = req.body
  // If the admin password is incorrect, trhow unauthorized error
  if (!validateAdmin(masterKey)) {
    return UNAUTHORIZED(
      res,
      'Sólo el administrador puede añadir habitaciones nuevas.'
    )
  }
  // If room already exists, throw conflict error
  const alreadyExistsRoom = await RoomModel.findOne({ roomType, roomName })
  if (alreadyExistsRoom) { return CONFLICT(res, `Ya existe ${roomName} del tipo ${roomType}`) }
  // Create the new room and save it
  const newRoom = new RoomModel({ roomType, roomName, reservations })
  await newRoom.save()
  res
    .status(200)
    .send({
      successmsg: `Habitación ${roomName} del tipo ${roomType} ha sido creada con éxito.`
    })
}
export default addRoomController
