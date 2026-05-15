const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Caterer = require('./models/Caterer');

dotenv.config();

const cities = [
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 
  'Edmonton', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax', 
  'Brampton', 'Mississauga'
];

const cuisines = [
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600' },
  { name: 'Italian', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600' },
  { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600' },
  { name: 'Mexican', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600' },
  { name: 'American BBQ', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=600' },
  { name: 'Japanese', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600' },
  { name: 'Vegan / Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
  { name: 'French', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600' },
];

const prefixNames = ['Golden', 'Royal', 'Authentic', 'Gourmet', 'Classic', 'Spicy', 'Urban', 'Boutique'];
const suffixNames = ['Events', 'Catering', 'Kitchen', 'Eats', 'Dining', 'Experiences', 'Feasts', 'Table'];

const generateDummyCaterers = () => {
  const caterers = [];
  let emailCounter = 100;
  
  cities.forEach(city => {
    // Create 3 caterers per city
    for(let i=0; i<3; i++) {
      const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
      const prefix = prefixNames[Math.floor(Math.random() * prefixNames.length)];
      const suffix = suffixNames[Math.floor(Math.random() * suffixNames.length)];
      
      caterers.push({
        name: `Chef ${prefix}`,
        email: `caterer${emailCounter}@example.com`,
        serviceName: `${prefix} ${cuisine.name} ${suffix} ${city}`,
        cuisine: cuisine.name,
        pricing: '$$ - $25/person',
        location: city,
        story: `Bringing the finest ${cuisine.name} culinary traditions to ${city}. We specialize in memorable events and delicious food.`,
        photos: [cuisine.image],
        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
        numReviews: Math.floor(Math.random() * 200) + 5,
        totalCustomers: Math.floor(Math.random() * 800) + 20,
        role: 'caterer',
        menu: [
          { name: 'Signature Starter', description: 'Freshly prepared seasonal appetizer.', price: '$12' },
          { name: 'Main Course', description: `Our most popular ${cuisine.name} dish.`, price: '$25' },
          { name: 'Dessert Platter', description: 'Assortment of sweet treats.', price: '$10' }
        ]
      });
      emailCounter++;
    }
  });
  return caterers;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    // We will NOT delete existing ones so we keep the ones we manually curated earlier,
    // we'll just add the new Canadian city ones on top!
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const generatedCaterers = generateDummyCaterers();
    
    // Add hashed password
    const caterersToInsert = generatedCaterers.map(c => ({
      ...c,
      password: hashedPassword,
    }));

    await Caterer.insertMany(caterersToInsert);
    console.log(`Successfully seeded ${caterersToInsert.length} additional caterers across all Canadian cities!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
