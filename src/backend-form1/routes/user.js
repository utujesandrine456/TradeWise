const express = require('express')
const router = express.Router()
const {
  getAllusers,
  getUserbyId,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usercontroller.js');



router.get('/', getAllusers);

router.get('/:id',getUserbyId );

router.post('/', createUser );

router.put(':id', updateUser);

router.delete('/:id', deleteUser);


module.exports = router;