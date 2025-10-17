const mongodb = require('../models/index')
const orders = mongodb.orders
const products = mongodb.products
const { createError } = require('../utils/index')
const invAudit = require('./inventoryAudit')
const swagger = require('swagger-autogen')();

/******************************************************
 * Create Order using Transaction
*******************************************************/

/* 
#swagger.tags = [Orders]
#swagger.description = 'Create product Order'
#swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/Order' }
  }
#swagger.responses[201]={
    description:'Order Successfully Created'
    schema: {$ref: '#/definitions/Order'}
}
#swagger.responses[400] = {
    description:'Order creation Failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const createOrder = async (req, res, next) => {
  const session = await mongodb.mongoose.startSession()

  try {
    session.startTransaction()

    if (!req.body || !req.body.items || req.body.items.length === 0) {
      throw createError(400, "Order data not provided or items missing.")
    }

    const {items, tax, discount } = req.body
    let total = 0
    const orderItems = []

    // Validate and update product stock 
    for (const item of items) {
      const product = await products.findById(item.productId).session(session)
      if (!product) throw createError(404, `Product not found: ${item.productId}`)
      if (product.quantity < item.quantity)
        throw createError(400, `Insufficient stock for ${product.name}, available: ${product.quantity}`)

      const subtotal = product.sellPrice * item.quantity
      total += subtotal

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.sellPrice,
        subtotal,
      })

      product.quantity -= item.quantity

      await product.save({ session }) 
    }

    // Compute totals
    if (tax) total += (tax / 100) * total
    if (discount) total -= (discount / 100) * total
    total = Number(total.toFixed(2))

    // Create order document
    const newOrder = {
      items: orderItems,
      total,
      tax,
      discount,
      status: "Pending",
      createdAt: new Date(),
    }
      
    const order = await orders.create([newOrder], { session }) 
    const savedOrder = order[0]

    for (const item of orderItems) {
      const newAudit = {
        productId: item.productId,
        userId: req.user._id,
        action: "Sale",
        quantityChanged: -item.quantity,
        note: `Order ${savedOrder._id} created`,
    }
        
      await invAudit.createInvAudit(newAudit, session)
    }

    // Commit transaction
    await session.commitTransaction()
    session.endSession()
    
    swagger.responses[201] = {
          description: "Order created successfully",
          schema: { $ref: '#/definitions/order/' }
    }
      
    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      result: savedOrder,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}


/***********************************************************
 * Update Order By ID
************************************************************/

/* 
#swagger.tags = [Order]
#swagger.description = 'Update order by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the order to  be updated.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Updated Successfully'
    schema: {$ref: '#/definitions/Order'}
}
#swagger.responses[400] = {
    description:'Update failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const updateOrder = async (req, res, next) => {
  const session = await mongodb.mongoose.startSession();

    try {
    session.startTransaction();
    const orderID = req.params.id;
      if (!Types.ObjectId.isValid(orderID)) {
          throw createError(400, "Bad Request! Invalid ID");
      }
    const oldOrder = await orders.findById(orderID).session(session);
      if (!oldOrder) {
          throw createError(404, "Order not found")
      };

    const {items, tax, discount, status } = req.body;
      if (!items || !Array.isArray(items)) {
          throw createError(400, "Bad request. Provide valid items.")
      };

    let newItems = [];
    let totalWithoutTax = 0;

    for (const item of items) {
      const product = await products.findById(item.productId).session(session);
        if (!product) {
            throw createError(404, `Product not found: ${item.productId}`)
        };

      const oldItem = oldOrder.items.find(i => i.productId.toString() === item.productId);
      const difference = item.quantity - (oldItem?.quantity || 0);

        if (product.quantity < difference) {
            throw createError(400, `Insufficient stock for ${product.name}`)
        };

      product.quantity -= difference;
      await product.save({ session });

      let subtotal = product.sellPrice * item.quantity;
      totalWithoutTax += subtotal;

      newItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.sellPrice,
        subtotal
      });

      await invAudit.createInvAudit({
        productId: product._id,
        userId: req.user._id,
        action: "Adjustment",
        quantityChanged: -difference,
        note: `Order ${orderID} updated`
      },session);
    }

    let total = totalWithoutTax;
      if (tax) {
          total += (tax / 100) * totalWithoutTax;
      }
      if (discount) {
          total -= (discount / 100) * totalWithoutTax;
      }

    const updatedOrder = await orders.findByIdAndUpdate(
      orderID,
      {
        items: newItems,
        total: Number(total.toFixed(2)),
        tax,
        status
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      result: updatedOrder
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


/***********************************************************
 * Retrieve all Orders made.
************************************************************/

/* 
#swagger.tags = [Order]
#swagger.description = 'Retrieve all Order'
#swagger.responses[200]={
    description:'Orders found'
    schema: {$ref: '#/definitions/Order'}
}
#swagger.responses[404] = {
    description:'No Order found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getOrders = async (req, res, next) => {
    try {

        const allOrders = await orders.find().sort({_id:-1});
        if (allOrders.length === 0) {
            return next(createError(400,"Orders not found"))
        }

        return res.status(200).json({
            status: 'success',
            message: "Sales Record found",
            result: allOrders
        });

    } catch (error) {
        next(error)
    }
}

/*********************************************
 * Retrieve Order By ID
*********************************************/

/* 
#swagger.tags = [Order]
#swagger.description = 'Retrieve order by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the order to be retrieved.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Order details'
    schema: {$ref: '#/definitions/Order'}
}
#swagger.responses[404] = {
    description:'Order not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getOrderById = async (req, res, next) => {
    try {

        const ordId = req.params.id;
        if (!Types.ObjectId.isValid(ordId)) {
            return next(createError(400,"Invalid ID"))
        }

        const orderInfo = await orders.findById({ _id: ordId });
        if (!orderInfo) {
            return next(createError(404, "Order not found or does not exist!"))
        }

        res.status(200).json({
            status: 'success',
            message: "Order found!",
            result: orderInfo
        })

    } catch (error) {
        next(error)
    }
}

/********************************************
 * Delete Order by ID
*********************************************/

/* 
#swagger.tags = [Order]
#swagger.description = 'Delete order by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the order to  be deleted.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Deleted Successfully'
    schema: {$ref: '#/definitions/Order'}
}
#swagger.responses[400] = {
    description:'Delete failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const removeOrderById = async (req, res, next) => {
    try {
        const ordId = req.params.id;
        if (!Types.ObjectId.isValid(ordId)) {
            return next(createError(400,"Invalid ID"))
        }
        const orderInfo = await orders.findByIdAndDelete(ordId);
        if (!orderInfo) {
            return next(createError(404,"Order not found or has been deleted."))
        }
        return res.status(200).json({
            status: "success",
            message: "Order was successfully deleted",
            result: orderInfo
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder,
    updateOrder,
    getOrders,
    getOrderById,
    removeOrderById
}