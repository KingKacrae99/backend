const router = require("express").Router();
const {
    getAllInvAudit,
    getInvAuditById,
    removeAuditById,
    updateInvAudit } = require("../controllers/inventoryAudit")
const wrapper = require("../middleware/wrapper");
const privilege = require("../middleware/auth")

router.get('/', privilege.isAdmin, wrapper(getAllInvAudit));
router.get('/:id', privilege.isAdmin, wrapper(getInvAuditById))
router.put('/update/:id', privilege.isAdmin, wrapper(updateInvAudit))
router.delete('/delete/:id', privilege.isAdmin, wrapper(removeAuditById))

module.exports = router;