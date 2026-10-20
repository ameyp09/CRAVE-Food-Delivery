const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const seedData = async (isAuto = true) => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Cleaning old records...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({})
    ]);

    console.log('[Seed] Seeding Users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      name: 'CRAVE Head Admin',
      email: 'admin@crave.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1 (555) 019-2834',
      addresses: [
        {
          street: '100 Foodie Boulevard, Suite 500',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          isDefault: true
        }
      ]
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'customer',
      phone: '+1 (555) 782-9901',
      addresses: [
        {
          street: '456 Gourmet Street, Apt 3B',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          isDefault: true
        },
        {
          street: '789 Tech Park Way, Floor 4',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          isDefault: false
        }
      ]
    });

    console.log('[Seed] Seeding Categories...');
    const categoriesData = [
      {
        name: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Asian',
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Desserts',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        isActive: true
      }
    ];

    const categories = await Category.insertMany(categoriesData);

    console.log('[Seed] Seeding 12 Food Items...');
    const foodsData = [
      {
        name: 'Margherita Basil Delight',
        description: 'San Marzano tomato sauce, fresh buffalo mozzarella, aromatic sweet basil leaves, and cold-pressed extra virgin olive oil on hand-stretched woodfired dough.',
        price: 299,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
        category: 'Pizza',
        rating: 4.8,
        isVeg: true,
        available: true,
        prepTime: '20-25 mins'
      },
      {
        name: 'Pepperoni Feast Supreme',
        description: 'Loaded with premium smoky cured pork pepperoni, bubbling whole-milk mozzarella cheese, crushed red peppers, and our secret herb-infused tomato sauce.',
        price: 449,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
        category: 'Pizza',
        rating: 4.9,
        isVeg: false,
        available: true,
        prepTime: '25-30 mins'
      },
      {
        name: 'Truffle Umami Smash Burger',
        description: 'Double caramelized Angus beef smash patties, aged sharp cheddar, truffle mushroom aioli, and crispy shallots served on a toasted artisanal brioche bun.',
        price: 349,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
        category: 'Burgers',
        rating: 4.9,
        isVeg: false,
        available: true,
        prepTime: '20-25 mins'
      },
      {
        name: 'Crispy Paneer & Jalapeño Burger',
        description: 'Golden spiced panko-crusted cottage cheese steak, spicy pickled jalapeños, crunchy shredded lettuce, and chipotle ranch spread on sesame seed bun.',
        price: 279,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        category: 'Burgers',
        rating: 4.6,
        isVeg: true,
        available: true,
        prepTime: '15-20 mins'
      },
      {
        name: 'Royal Hyderabadi Dum Biryani',
        description: 'Long-grain aged basmati rice layered with succulent marinated chicken pieces, infused with saffron, caramelized onions, fresh mint, served with Mirchi Ka Salan and Raita.',
        price: 389,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        category: 'Biryani',
        rating: 4.9,
        isVeg: false,
        available: true,
        prepTime: '30-40 mins'
      },
      {
        name: 'Lucknowi Subz Dum Biryani',
        description: 'Fragrant saffron basmati rice slow-cooked in handi with organic garden vegetables, fragrant spices, whole green cardamom, and toasted golden cashews.',
        price: 299,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
        category: 'Biryani',
        rating: 4.7,
        isVeg: true,
        available: true,
        prepTime: '25-35 mins'
      },
      {
        name: 'Bangkok Pad Thai Noodles',
        description: 'Wok-tossed rice noodles with succulent prawns, firm tofu cubes, crushed roasted peanuts, fresh bean sprouts, and authentic tamarind palm sugar glaze.',
        price: 329,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
        category: 'Asian',
        rating: 4.7,
        isVeg: false,
        available: true,
        prepTime: '20-25 mins'
      },
      {
        name: 'Steamed Dim Sum Symphony',
        description: 'Assorted basket of 6 crystal vegetable dumplings filled with wild shiitake mushrooms, water chestnuts, bok choy, served with house fiery chili oil.',
        price: 269,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
        category: 'Asian',
        rating: 4.8,
        isVeg: true,
        available: true,
        prepTime: '15-20 mins'
      },
      {
        name: 'Molten Dark Chocolate Lava Cake',
        description: 'Rich Belgian 70% dark chocolate sponge with a warm oozing molten center, dusted with confectioners sugar and cocoa powder.',
        price: 199,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        category: 'Desserts',
        rating: 4.9,
        isVeg: true,
        available: true,
        prepTime: '10-15 mins'
      },
      {
        name: 'New York Blueberry Cheesecake',
        description: 'Velvety smooth Philadelphia cream cheese filling over a buttery cinnamon graham cracker crust, topped with whole wild blueberry compote.',
        price: 249,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        category: 'Desserts',
        rating: 4.8,
        isVeg: true,
        available: true,
        prepTime: '10 mins'
      },
      {
        name: 'Cold Brew Vanilla Cream Frappé',
        description: 'Single-origin Arabica 18-hour cold brew blended with Madagascar vanilla bean extract, farm-fresh milk, and silky whipped cream cloud.',
        price: 179,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        category: 'Beverages',
        rating: 4.7,
        isVeg: true,
        available: true,
        prepTime: '5-10 mins'
      },
      {
        name: 'Sparkling Passion Citrus Mojito',
        description: 'Crushed organic mint leaves, freshly squeezed Persian lime juice, passionfruit pulp, and fizzing sparkling club soda over crushed ice rocks.',
        price: 149,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        category: 'Beverages',
        rating: 4.6,
        isVeg: true,
        available: true,
        prepTime: '5 mins'
      }
    ];

    const foods = await Food.insertMany(foodsData);

    console.log('[Seed] Seeding sample orders for John Doe...');
    const now = new Date();

    const sampleOrders = [
      {
        user: customer._id,
        items: [
          {
            food: foods[0]._id,
            name: foods[0].name,
            price: foods[0].price,
            quantity: 2,
            image: foods[0].image
          },
          {
            food: foods[11]._id,
            name: foods[11].name,
            price: foods[11].price,
            quantity: 1,
            image: foods[11].image
          }
        ],
        deliveryAddress: {
          street: customer.addresses[0].street,
          city: customer.addresses[0].city,
          state: customer.addresses[0].state,
          zipCode: customer.addresses[0].zipCode,
          phone: customer.phone
        },
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        subtotal: 747,
        deliveryFee: 0,
        totalAmount: 747,
        orderStatus: 'Preparing',
        statusTimeline: [
          { status: 'Order Placed', timestamp: new Date(now.getTime() - 25 * 60 * 1000) },
          { status: 'Confirmed', timestamp: new Date(now.getTime() - 20 * 60 * 1000) },
          { status: 'Preparing', timestamp: new Date(now.getTime() - 10 * 60 * 1000) }
        ],
        createdAt: new Date(now.getTime() - 25 * 60 * 1000)
      },
      {
        user: customer._id,
        items: [
          {
            food: foods[4]._id,
            name: foods[4].name,
            price: foods[4].price,
            quantity: 1,
            image: foods[4].image
          },
          {
            food: foods[8]._id,
            name: foods[8].name,
            price: foods[8].price,
            quantity: 1,
            image: foods[8].image
          }
        ],
        deliveryAddress: {
          street: customer.addresses[0].street,
          city: customer.addresses[0].city,
          state: customer.addresses[0].state,
          zipCode: customer.addresses[0].zipCode,
          phone: customer.phone
        },
        paymentMethod: 'COD',
        paymentStatus: 'Completed',
        subtotal: 588,
        deliveryFee: 0,
        totalAmount: 588,
        orderStatus: 'Delivered',
        statusTimeline: [
          { status: 'Order Placed', timestamp: new Date(now.getTime() - 120 * 60 * 1000) },
          { status: 'Confirmed', timestamp: new Date(now.getTime() - 110 * 60 * 1000) },
          { status: 'Preparing', timestamp: new Date(now.getTime() - 95 * 60 * 1000) },
          { status: 'Out for Delivery', timestamp: new Date(now.getTime() - 70 * 60 * 1000) },
          { status: 'Delivered', timestamp: new Date(now.getTime() - 40 * 60 * 1000) }
        ],
        createdAt: new Date(now.getTime() - 120 * 60 * 1000)
      },
      {
        user: customer._id,
        items: [
          {
            food: foods[2]._id,
            name: foods[2].name,
            price: foods[2].price,
            quantity: 1,
            image: foods[2].image
          }
        ],
        deliveryAddress: {
          street: customer.addresses[1].street,
          city: customer.addresses[1].city,
          state: customer.addresses[1].state,
          zipCode: customer.addresses[1].zipCode,
          phone: customer.phone
        },
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        subtotal: 349,
        deliveryFee: 40,
        totalAmount: 389,
        orderStatus: 'Order Placed',
        statusTimeline: [
          { status: 'Order Placed', timestamp: new Date(now.getTime() - 5 * 60 * 1000) }
        ],
        createdAt: new Date(now.getTime() - 5 * 60 * 1000)
      }
    ];

    await Order.insertMany(sampleOrders);

    // Initial cart for customer
    await Cart.create({
      user: customer._id,
      items: [
        { food: foods[1]._id, quantity: 1 }
      ]
    });

    console.log('----------------------------------------------------');
    console.log('🎉 CRAVE DATABASE SEEDED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Default Accounts:');
    console.log('👉 ADMIN:    admin@crave.com  / admin123');
    console.log('👉 CUSTOMER: john@example.com / user123');
    console.log(`👉 Categories: ${categories.length}`);
    console.log(`👉 Food Items: ${foods.length}`);
    console.log(`👉 Sample Orders: ${sampleOrders.length}`);
    console.log('----------------------------------------------------');

    if (!isAuto) {
      process.exit(0);
    }
    return { success: true };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (!isAuto) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData(false);
}

module.exports = seedData;

