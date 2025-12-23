import { z } from "zod";
import { prisma } from "../database/prisma.js";

const calculateTotalAmount = (cartItems) => {
  let total = 0;
  for (const item of cartItems) {
    const basePrice = item.product.basePrice;
    const variantPrice = item.variant ? item.variant.priceAdjustment : 0;
    const price = basePrice + variantPrice;
    total += price * item.quantity;
  }
  return total;
};

export const createOrder = async (req, res) => {
  const userid = req.user.id;
  const { shipmentAddress, paymentMethod } = req.body;

  const createOrderSchema = z.object({
    shipmentAddress: z.object({
      fullName: z.string().min(3),
      phoneNumber: z.string().min(10),
      addressLine1: z.string().min(5),
      addressLine2: z.string().optional(),
    }),
    paymentMethod: z.string().min(3),
  });

  const { success, data, error } = createOrderSchema.safeParse({
    shipmentAddress,
    paymentMethod,
  });

  console.log("Creating order for user:", userid);

  if (!success) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Invalid input",
        errors: error.errors,
      });
  }

  // get the cart id for the user
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userid,
    },
    include: {
      cartItems: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    return res.status(400).json({ status: "error", message: "Cart is empty" });
  }

  // calculate total amount
  const totalAmount = calculateTotalAmount(cart.cartItems);

  const order = await prisma.$transaction(async (txPrisma) => {
    // create the new order
    const newOrder = await txPrisma.order.create({
      data: {
        userId: userid,
        totalAmount: totalAmount,
        shippingAddressSnapshot: data.shipmentAddress,
        paymentMethod: data.paymentMethod,
      },
    });

    // add order items
//      model OrderItem {
//   id String @id @default(uuid()) @db.Uuid()
//   orderId String @db.Uuid()
//   productId String? @db.Uuid()
//   productSnapshot Json
//   variantSnapshot Json?
//   quantity Int
//   priceAtPurchase Float
//   totalPrice Float

//   order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
//   product Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
// }
    const orderItemsData = cart.cartItems.map((item) => {

      const basePrice = item.product.basePrice;
      const variantPrice = item.variant ? item.variant.priceAdjustment : 0;
      const price = basePrice + variantPrice;

      const productSnapshot = {
        id: item.product.id,
        title: item.product.title,
        basePrice: item.product.basePrice,
        originalPrice: item.product.originalPrice,
        description: item.product.description,
      };
      const variantSnapshot = item.variant
        ? {
            id: item.variant.id,
            variantName: item.variant.variantName,
            variantValue: item.variant.variantValue,
            priceAdjustment: item.variant.priceAdjustment,
          }
        : null;

      return {
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: price,
        totalPrice: price * item.quantity,
        productSnapshot: productSnapshot,
        variantSnapshot: variantSnapshot,
      };
    });

    await txPrisma.orderItem.createMany({
      data: orderItemsData,
    });

    // update the stock
    for (const item of cart.cartItems) {
      if (item.variantId) {
        // reduce variant stock
        await txPrisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      } else {
        // reduce product stock
        await txPrisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // clear the cart
    await txPrisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    return newOrder;
  });

  res.json({
    status: "success",
    message: "Order created successfully",
    order: order,
  });
};

export const getOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  res.json({
    status: "success",
    message: "Orders retrieved successfully",
    orders: orders,
  });
};

export const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    return res.status(404).json({
      status: "error",
      message: "Order not found",
    });
  }

  res.json({
    status: "success",
    message: "Order retrieved successfully",
    order: order,
  });
};

export const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const { status, paymentStatus } = req.body;

  const updateOrderSchema = z.object({
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
  });

  const { success, data, error } = updateOrderSchema.safeParse({ status, paymentStatus });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Invalid input",
      errors: error.errors,
    });
  }

  // find the order
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return res.status(404).json({
      status: "error",
      message: "Order not found",
    });
  }

  // only allow admin to update order status, or the user who owns the order to cancel
  if (userRole !== "ADMIN" && order.userId !== userId) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: You don't have permission to update this order",
    });
  }

  // customers can only cancel their own orders (not change status/payment)
  if (userRole !== "ADMIN") {
    if (data.status && data.status !== "CANCELLED") {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: Customers can only cancel orders",
      });
    }
    if (data.paymentStatus) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: Customers cannot update payment status",
      });
    }
  }

  const updateData = {};
  if (data.status) updateData.status = data.status;
  if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: updateData,
    include: {
      orderItems: true,
    },
  });

  res.json({
    status: "success",
    message: "Order updated successfully",
    order: updatedOrder,
  });
};

export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return res
      .status(404)
      .json({ status: "error", message: "Order not found" });
  }

  await prisma.order.delete({
    where: {
      id: orderId,
    },
  });

  res.json({
    status: "success",
    message: "Order deleted successfully",
  });
};
