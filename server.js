
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const User = require('./models/userModel');
const productRoutes = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const userControl = require('./routes/usercontrol');
const BlogsRouter = require('./routes/blogRouter');
const uploadRouter = require('./routes/uploadAvatar');
const workshopRouter = require('./routes/workshopRouter');
const chatRouter = require('./routes/chatRouter');

const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cookieParser());
// app.use(cors({
//     origin: [
//         // process.env.FRONTEND_URL
//         'http://localhost:3000',
//         'https://doris-flower-frontend.onrender.com',
//     ],
//     credentials: true,
// }));
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://doris-flower-frontend.onrender.com',
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));





// Connect MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


const createDefaultAdmin = async () => {
    try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            adminUser = new User({
                username: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
                billingDetails: {
                    firstName: "Admin",
                    lastName: "Doris",
                    email: "DorisNgoc@gmail.com",
                    phone: "0332464663",
                    province: "Ho Chi Minh",
                    streetAddress: "Binh Hung Commune, Binh Chanh District",
                }
            });

            await adminUser.save();
            console.log('Default admin created.');

        } else {
            if (!adminUser.isAdmin) {
                adminUser.isAdmin = true;
                await adminUser.save();
                console.log('Admin user updated with admin privileges.');
            } else {
                console.log('Admin user already exists.');;
            }
        }
    } catch (err) {
        console.error('Error creating default admin:', err);
    }
};

createDefaultAdmin();


// Use route
app.use('/api/users', userRouter);
app.use('/api/controlUsers', userControl);
app.use('/api/products', productRoutes);
app.use('/api/blogs', BlogsRouter);
app.use('/api/workshops', workshopRouter);
app.use('/api/avatarUploads', uploadRouter);
app.use('/api/chatbox', chatRouter);
app.options('*', cors());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Run server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
