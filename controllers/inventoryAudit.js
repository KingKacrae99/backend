const mongodb = require("../models/index")
const { createError } = require("../utils")
const InventoryAudit = mongodb.inventory
const Types = mongodb.mongoose.Types


/********************************************************
 * Inventory Audit untility function for creating Audit 
********************************************************/
async function createInvAudit(newAudit, session) {
  try {
    const invAudit = await InventoryAudit.create([newAudit], { session })
    return invAudit[0]
  } catch (error) {
    throw error
  }
}

/*************************************************
 * Retrieve all Inventory Audit
**************************************************/
const getAllInvAudit = async (req,res,next) => {
    try {
        const allAudits = await InventoryAudit.find().sort({ _id: -1 });
        if (allAudits.length === 0) {
            return next(createError(404, "No inventory audit found"));
        }

        return res.status(200).json({
            status: "success",
            message: "Audit found!",
            result:allAudits
        })

    } catch (error) {
        next(error)
    }
}

/*******************************************************
 * Retrieve Inventory Audit By ID
********************************************************/
const getInvAuditById = async (req, res, next) => {
    try {
        
        const auditID = req.params.id;
        if (!Types.ObjectId.isValid(auditID)) {
            return next(createError(400,"Bad Request! Invalid ID"))
        }

        const audit = await InventoryAudit.findById(auditID);
        if (!audit) {
            return next(createError(404,"No inventory audit with such ID found"))
        }

        return res.status(200).json({
            status: "success",
            message: "Audit found!",
            result: audit
        });
    } catch (error) {
        next(error)
    }
}

/***********************************************
 * Delete Inventory 
***********************************************/
const removeAuditById = async (req,res,next) => {
    try {
        const auditID = req.params.id;
        if (!Types.ObjectId.isValid(auditID)) {
            return next(createError(400,"Bad Request! invalid ID"))
        }
        const deleteInvAudit = await InventoryAudit.findByIdAndDelete(auditID);
        if (!deleteInvAudit) {
            return next(createError(400,"Delete not successfully, audit not found"))
        }
        return res.status(200).json({
            status: "success",
            message: "Inventory Audit was successfully deleted",
            result: deleteInvAudit
        })
    } catch (error) {
        next(error)
    }
}

const updateInvAudit = async (req,res,next) => {
    try {
        const auditID = req.params.id;
        if (!Types.ObjectId.isValid(auditID)) {
            return next(createError(400,"Bad Request! Invalid Id"))
        }
        const update = {
            isRead: true
        }
        const filter = { _id: auditID }
        const updatedAudit = await InventoryAudit.updateOne(filter, update)
        if (updatedAudit.modifiedCount === 0) {
            return next(createError(404,"Request failed!"))
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createInvAudit,
    getAllInvAudit,
    getInvAuditById,
    removeAuditById,
    updateInvAudit
}